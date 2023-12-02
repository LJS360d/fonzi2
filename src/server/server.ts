import axios from 'axios';
import { Client } from 'discord.js';
import express, { NextFunction, type Request, type Response } from 'express';
import session from 'express-session';
import http from 'http';
import { CC, Logger } from '../log/logger';
import { env } from '../main';
export class Fonzi2Server {
	private port: number = env.PORT;
	private app: express.Application;
	private httpServer: http.Server;
	constructor(private client: Client) {
		this.app = express();
		this.httpServer = http.createServer(this.app);
		this.app.use(express.static('public'));
		this.app.use(express.json());
		this.app.use(
			session({
				secret: 'boo',
				resave: false,
				saveUninitialized: false,
			})
		);
		this.app.set('view engine', 'ejs');
	}

	start() {
		this.httpServer.listen(this.port, () => {
			Logger.info(
				env.NODE_ENV === 'development'
					? `Server listening on ${CC.doubleUnderline}http://localhost:${env.PORT}`
					: `Server open on port ${env.PORT}`
			);
		});
		this.app.get('/', this.authorize.bind(this));
		this.app.get('/unauthorized', this.unauthorized.bind(this));
		this.app.get('/notfound', this.notFound.bind(this));
		this.app.get('/login', this.login.bind(this));
		this.app.post('/login', this.loginPost.bind(this));
		this.app.get('/dashboard', this.dashboard.bind(this));

		this.app.use(this.notFoundMiddleware.bind(this));

		// shutdown Hooks
		['SIGINT', 'SIGTERM'].forEach((signal) => {
			process.on(signal, this.stop.bind(this));
		});
	}

	dashboard(req: Request, res: Response) {
		if (!req.session['accessToken']) {
			res.redirect('/unauthorized');
			return;
		}
		const props = {
			client: this.client,
			guilds: this.client.guilds.cache,
			startTime: Date.now(),
			version: env.VERSION,
		};
		res.render('dashboard', props);
	}

	authorize(req: Request, res: Response) {
		res.redirect(env.OAUTH2_URL);
	}

	login(req: Request, res: Response) {
		res.render('login');
	}

	unauthorized(req: Request, res: Response) {
		res.render('unauthorized');
	}

	notFound(req: Request, res: Response) {
		res.render('notfound');
	}

	notFoundMiddleware(req: Request, res: Response, next: NextFunction) {
		res.redirect('/notfound');
		next();
	}

	async loginPost(req: Request, res: Response) {
		const { accessToken } = req.body;
		try {
			const authResponse = await axios.get('https://discord.com/api/v10/users/@me', {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			if (env.OWNER_IDS.includes(authResponse.data.id)) {
				// TODO session store the access token
				req.session['accessToken'] = accessToken;
				res.status(302).json({ route: '/dashboard' });
			} else res.status(401).json({ route: '/unauthorized' });
		} catch (error: any) {
			res.status(500).json(error);
		}
	}

	stop() {
		this.httpServer.close();
	}
}
