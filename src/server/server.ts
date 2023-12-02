import { Client } from 'discord.js';
import express, { type Request, type Response } from 'express';
import http from 'http';
import { Logger } from '../log/logger';
import { env } from '../main';
import { sign } from 'crypto';

export class Fonzi2Server {
	private port: number = 8080;
	private app: express.Application;
	private httpServer: http.Server;
	constructor(private client: Client) {
		this.app = express();
		this.httpServer = http.createServer(this.app);
		this.app.use(express.static('public'));
		this.app.set('view engine', 'ejs');
	}

	start() {
		this.httpServer.listen(this.port, () => {
			Logger.info(`Server open on port ${this.port}`);
		});
		this.app.get('/', this.dashboard.bind(this));

		// shutdown Hooks
		['SIGINT', 'SIGTERM'].forEach((signal) => {
			process.on(signal, this.stop.bind(this));
		});
	}

	dashboard(req: Request, res: Response) {
		const props = {
			client: this.client,
			guilds: this.client.guilds.cache,
			startTime: Date.now(),
			version: env.VERSION,
		};
		res.render('dashboard', props);
	}

	stop() {
		this.httpServer.close();
		Logger.warn('Server closed');
	}
}
