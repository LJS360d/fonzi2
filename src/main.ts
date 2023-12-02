import 'dotenv/config';
import Fonzi2Client from './client/client';
import { options } from './client/options';
import { CommandInteractionsHandler } from './events/handlers/commands/commands.handler';
import { ClientEventsHandler } from './events/handlers/common/client.events.handler';
import { Logger } from './log/logger';
export const env = {
	// ! [REQUIRED] the discord bot's token
	TOKEN: process.env.TOKEN!,
	// ? [Recommended] a webhook for logs
	LOG_WEBHOOK: process.env.LOG_WEBHOOK,
	// ! [REQUIRED] OAuth2 credentials
	OAUTH2_URL: process.env.OAUTH2_URL!,
	OWNER_IDS: process.env.OWNER_IDS!.split(','),
	// * npm package version
	VERSION: process.env.npm_package_version!,
	// * the server's port (default: 8080)
	PORT: Number(process.env.PORT) || 8080,
	// * the current environment (default: development)
	NODE_ENV: (process.env.NODE_ENV || 'development') as
		| 'development'
		| 'staging'
		| 'production',
} as const;

const client = new Fonzi2Client(
	options,
	new ClientEventsHandler(),
	new CommandInteractionsHandler()
);
client.login(env.TOKEN);

process.on('SIGINT', async () => {
	Logger.warn('Received SIGINT signal. Shutting down gracefully...');
	process.exit(0);
});

process.on('SIGTERM', async () => {
	Logger.warn('Received SIGTERM signal. Shutting down gracefully...');
	process.exit(0);
});

process.on('uncaughtException', (err) => {
	Logger.error(`${err.name} ${err.message}`);
});
