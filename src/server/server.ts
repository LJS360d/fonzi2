import axios, { AxiosResponse } from 'axios';
import session from 'cookie-session';
import crypto from 'crypto';
import { Client } from 'discord.js';
import express, { NextFunction, type Request, type Response } from 'express';
import http from 'http';
import { AddressInfo } from 'net';
import { resolve } from 'path';
import { Logger } from '../logger/logger';
import { DiscordUserInfo } from '../types/discord.user.info';
export interface Fonzi2ServerData {
	inviteLink: string;
	ownerIds: string[];
	version: string;
	oauth2url: string;
	port?: number;
}

export class Fonzi2Server {
	protected readonly startTime = Date.now();
	protected app: express.Application;
	protected httpServer: http.Server;
	constructor(
		protected client: Client,
		protected data: Fonzi2ServerData
	) {
		this.app = express();
		this.app.use(express.static(resolve(__dirname, 'public')));
		this.app.set('view engine', 'ejs');
		this.app.set('views', resolve(__dirname, 'views'));
		this.app.use(express.json());
		const secret = crypto
			.createHash('sha3-256')
			.update(JSON.stringify(data))
			.digest('hex');
		this.app.use(session({ secret }));
		this.httpServer = http.createServer(this.app);
	}

	start() {
    this.app.get('/', this.authorize.bind(this));
		this.app.get('/unauthorized', this.unauthorized.bind(this));
		this.app.get('/notfound', this.notFound.bind(this));
		this.app.get('/login', this.login.bind(this));
		this.app.post('/login', this.loginPost.bind(this));
		this.app.get('/dashboard', this.dashboard.bind(this));
    
		this.app.use(this.notFoundMiddleware.bind(this));
		this.httpServer.listen(this.data.port, this.logServerStatus.bind(this));
		/* this.httpServer.on('request', (req, res) => {
      Logger.trace(`[${req.method}] ${req.url} ${res.statusCode}`);
    }) */
	}

	stop() {
		this.httpServer.close();
	}

	protected dashboard(req: Request, res: Response) {
		const userInfo = req.session!['userInfo'];
		if (!userInfo) {
			res.redirect('/unauthorized');
			return;
		}
		const props = {
			client: this.client,
			guilds: this.client.guilds.cache,
			startTime: this.startTime,
			version: this.data.version,
			inviteLink: this.data.inviteLink,
			userInfo,
		};
		res.render('default/dashboard', props);
	}

	protected authorize(req: Request, res: Response) {
		const userInfo = req.session!['userInfo'];
		if (!userInfo) {
			res.redirect(this.data.oauth2url);
			return;
		}
		res.redirect('/dashboard');
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
		res.redirect('/notfound');
		next();
	}

	protected async loginPost(req: Request, res: Response) {
		const { accessToken } = req.body;
		try {
			const userInfo = await this.getDiscordAuthUserInfo(accessToken);
			const skipAuth = this.data.ownerIds.length === 0;
			if (skipAuth || this.data.ownerIds.includes(userInfo.id)) {
				req.session!['userInfo'] = userInfo;
				res.status(302).json({ route: '/dashboard' });
			} else res.status(401).json({ route: '/unauthorized' });
		} catch (error: any) {
			res.status(502).json({ msg: error.message });
		}
	}

	protected async getDiscordAuthUserInfo(accessToken: string): Promise<DiscordUserInfo> {
		try {
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
			return authResponse.data;
		} catch (error: any) {
			throw error;
		}
	}

	protected logServerStatus() {
		const port = (this.httpServer.address() as AddressInfo).port;
		if (process.env['NODE_ENV'] === 'development') {
			Logger.info(`Server listening on &uhttp://localhost:${port}$`);
		}
		if (process.env['NODE_ENV'] === 'production') {
			Logger.info(`Server listening on port ${port}`);
		}
	}
}
