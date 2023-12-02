import { info } from 'console';
import Fonzi2Client from './client/client';
import { options } from './client/options';
import { error } from './log/logging';
import 'reflect-metadata';
/**
 * * Create a .env file in the project's root with at least these properties
 * ! TOKEN=<bot_token>
 * ! OWNER_ID=<user_id>
 * ? LOG_WEBHOOK=<webhook_url>
 */
import 'dotenv/config';
import { ClientEventsHandler } from './events/handlers/common/client.events.handler';
import { CommandInteractionsHandler } from './events/handlers/commands/commands.handler';
export const env = {
	// ! [REQUIRED] the discord bot's token
	TOKEN: process.env.TOKEN!,
	// ! [REQUIRED] the discord user id of the bot's owner/developer
	OWNER_ID: process.env.OWNER_ID!,
	// ? [Recommended] a webhook for logs
	LOG_WEBHOOK: process.env.LOG_WEBHOOK,
	// * npm package version
	VERSION: process.env.npm_package_version!,
} as const;
const client = new Fonzi2Client(
	options,
	env.OWNER_ID,
	new ClientEventsHandler(),
	new CommandInteractionsHandler()
);
client.login(env.TOKEN);
process.on('SIGINT', async () => {
	info('Received SIGINT signal. Shutting down gracefully...');
	process.exit(0);
});

process.on('SIGTERM', async () => {
	info('Received SIGTERM signal. Shutting down gracefully...');
	process.exit(0);
});

process.on('uncaughtException', (err) => {
	error(`${err.name} ${err.message}`);
});
