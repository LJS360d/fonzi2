import axios, { AxiosResponse } from 'axios';
import session from 'cookie-session';
import crypto from 'crypto';
import { Client } from 'discord.js';
import 'dotenv/config';
import express, { NextFunction, type Request, type Response } from 'express';
import http from 'http';
import { AddressInfo } from 'net';
import { resolve } from 'path';
import { getRegisteredCommands } from '../client/decorators/command.interaction.dec';
import { Logger } from '../logger/logger';
import { DiscordUserInfo } from '../types/discord.user.info.js';
import { ServerController } from './base.controller';
import { getServerConfig } from './config';
import { RouteDefinitionMetadata, getRoutesMetadata } from './decorators/routing.dec';
export class Fonzi2Server {
  public readonly startTime = Date.now();
  protected readonly app: express.Application;
  protected readonly httpServer: http.Server;
  public readonly config = getServerConfig();
  constructor(
    protected client: Client<true>,
    controllers: ServerController[]
  ) {
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.app.use(express.static(resolve(__dirname, 'public')));
    this.app.set('view engine', 'ejs');
    this.app.set('views', resolve(__dirname, 'views'));
    this.app.use(express.json());
    const secret = crypto.createHash('sha3-256').update(JSON.stringify(this.config)).digest('hex');
    this.app.use(session({ secret, keys: ['user'], maxAge: 24 * 60 * 60 * 1000 }));
    this.setupControllerRoutes(controllers);
  }

  private setupControllerRoutes(controllers: ServerController[]) {
    controllers.forEach((controller) => {
      controller.setup(this.app, this.client);
      const routes: RouteDefinitionMetadata[] = getRoutesMetadata(controller);
      routes.forEach((route) => {
        this.app[route.requestMethod](
          route.path,
          ...(route.middlewares ?? []),
          route.method.bind(controller)
        );
      });
    });
  }

  start() {
    if (this.config.discordAuthRoute) {
      this.app.get(this.config.discordAuthRoute, this.authorize.bind(this));
    }
    if (this.config.unauthorizedRoute) {
      this.app.get(this.config.unauthorizedRoute, this.unauthorized.bind(this));
    }
    if (this.config.loginRoute) {
      this.app.get(this.config.loginRoute, this.login.bind(this));
      this.app.post(this.config.loginRoute, this.loginPost.bind(this));
    }
    if (this.config.dashboardRoute) {
      this.app.get(this.config.dashboardRoute, this.dashboard.bind(this));
    }
    if (this.config.notFoundRoute) {
      this.app.get(this.config.notFoundRoute, this.notFound.bind(this));
      if (this.config.notFoundRedirect) {
        this.app.use(this.notFoundMiddleware.bind(this));
      }
    }
    this.httpServer.listen(this.config.port, this.logServerStatus.bind(this));
  }

  public async stop() {
    await new Promise<void>((res, rej) => {
      this.httpServer.close((err) => {
        if (err) rej(err);
        res();
      });
    });
  }

  protected dashboard(req: Request, res: Response) {
    const userInfo = this.checkSession(req, res);
    if (!userInfo) return;
    const props = {
      client: this.client,
      guilds: this.client.guilds.cache,
      startTime: this.startTime,
      version: process.env['npm_package_version'],
      commands: getRegisteredCommands(),
      userInfo,
    };
    res.render('default/dashboard', props);
  }

  protected authorize(req: Request, res: Response) {
    const userInfo = this.getSessionUserInfo(req);
    if (!userInfo) {
      res.redirect(this.config.loginData.oauth2url);
      return;
    }
    // TODO configurable index redirect
    res.redirect(this.config.dashboardRoute);
  }

  protected login(req: Request, res: Response) {
    res.render('default/login');
  }

  protected unauthorized(req: Request, res: Response) {
    res.render('default/unauthorized');
  }

  protected notFound(req: Request, res: Response) {
    res.render('default/notfound');
  }

  protected notFoundMiddleware(req: Request, res: Response, next: NextFunction) {
    res.redirect(this.config.notFoundRoute);
    next();
  }

  protected async loginPost(req: Request, res: Response) {
    const { accessToken } = req.body;
    try {
      const userInfo = await this.getDiscordAuthUserInfo(accessToken);
      const skipAuth = this.config.loginData.ownerIds.length === 0;
      if (skipAuth || this.config.loginData.ownerIds.includes(userInfo.id)) {
        req.session!['userInfo'] = userInfo;
        res.status(302).json({ route: this.config.dashboardRoute });
      } else res.status(401).json({ route: this.config.unauthorizedRoute });
    } catch (error: any) {
      res.status(502).json({ msg: error.message });
    }
  }

  async getDiscordAuthUserInfo(accessToken: string): Promise<DiscordUserInfo> {
    const authResponse: AxiosResponse<DiscordUserInfo, any> = await axios.get(
      'https://discord.com/api/v10/users/@me',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const userId = authResponse.data.id;
    const userAvatarHash = authResponse.data.avatar;
    authResponse.data.avatar = `https://cdn.discordapp.com/avatars/${userId}/${userAvatarHash}.png`;
    authResponse.data.role = this.config.loginData.ownerIds.includes(userId) ? 'owner' : 'user';
    return authResponse.data;
  }

  protected checkSession(
    req: Request,
    res: Response,
    redirect: string | null = this.config.unauthorizedRoute
  ) {
    const userInfo = this.getSessionUserInfo(req);
    if (!userInfo) {
      if (redirect) res.redirect(redirect);
      return undefined;
    }
    return userInfo;
  }

  protected getSessionUserInfo(req: Request): DiscordUserInfo | undefined {
    const session = req.session;
    if (!session) return;
    return session['userInfo'];
  }

  protected checkOwner(req: Request): boolean {
    const session = req.session;
    if (!session) return false;
    return !!session['userInfo'].owner;
  }

  protected logServerStatus(): void {
    const port = (this.httpServer.address() as AddressInfo).port;
    if (process.env['NODE_ENV'] === 'development') {
      Logger.info(`Server listening on &uhttp://localhost:${port}$`);
      return;
    }
    Logger.info(`Server listening on port ${port}`);
  }
}
