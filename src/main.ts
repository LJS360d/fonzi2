import Fonzi2Client from './client/client';
import { options } from './client/options';
import {
	getCommandsMetadata,
	getRegisteredCommands,
} from './events/decorators/command.interaction.dec';
import { ButtonInteractionHandler } from './events/handlers/buttons/buttons.handler';
import { CommandInteractionsHandler } from './events/handlers/commands/commands.handler';
import { ClientEventsHandler } from './events/handlers/common/client.events.handler';
import { env, validateEnv } from './lib/env';
import { Logger } from './lib/logger';
validateEnv();
const client = new Fonzi2Client(options, [
	new CommandInteractionsHandler(),
	new ButtonInteractionHandler(),
	new ClientEventsHandler(getRegisteredCommands()),
]);
client.login(env.TOKEN);

process.on('uncaughtException', (err) => {
	Logger.error(`${err.name}: ${err.message}\n${err.stack}`);
});

['SIGINT', 'SIGTERM'].forEach((signal) => {
	process.on(signal, () => {
		Logger.warn(`Received ${signal} signal`);
		process.exit(0);
	});
});
