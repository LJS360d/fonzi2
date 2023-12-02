import 'reflect-metadata';
import Fonzi2Client from './client/client';
import { options } from './client/options';
/**
 * * Create a .env file in the project's root with at least these properties
 * ! TOKEN=<bot_token>
 * ? LOG_WEBHOOK=<webhook_url>
 */
import 'dotenv/config';
import { CommandInteractionsHandler } from './events/handlers/commands/commands.handler';
import { ClientEventsHandler } from './events/handlers/common/client.events.handler';
import { Logger } from './log/logger';
export const env = {
	// ! [REQUIRED] the discord bot's token
	TOKEN: process.env.TOKEN!,
	// ? [Recommended] a webhook for logs
	LOG_WEBHOOK: process.env.LOG_WEBHOOK,
	// * npm package version
	VERSION: process.env.npm_package_version!,
} as const;

const client = new Fonzi2Client(
	options,
	new ClientEventsHandler(),
	new CommandInteractionsHandler()
);
client.login(env.TOKEN);

process.on('SIGINT', async () => {
	Logger.info('Received SIGINT signal. Shutting down gracefully...');
	process.exit(0);
});

process.on('SIGTERM', async () => {
	Logger.info('Received SIGTERM signal. Shutting down gracefully...');
	process.exit(0);
});

process.on('uncaughtException', (err) => {
	Logger.error(`${err.name} ${err.message}`);
});
