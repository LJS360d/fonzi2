import { Fonzi2Client } from '../../src/client/client';
import { options } from './options';
import { getRegisteredCommands } from '../../src/events/decorators/command.interaction.dec';
import { ButtonInteractionHandler } from './handlers/buttons/buttons.handler';
import { CommandInteractionsHandler } from './handlers/commands/commands.handler';
import { ClientEventsHandler } from './handlers/client-events/client.events.handler';
import { Logger } from '../../src/lib/logger/logger';
import { MessageHandler } from './handlers/message/message.handler';
import { env } from './env';

new Fonzi2Client(env.TOKEN, options, [
	new CommandInteractionsHandler(),
	new ButtonInteractionHandler(),
	new MessageHandler(),
	new ClientEventsHandler(getRegisteredCommands()),
]);

process.on('uncaughtException', (err) => {
	Logger.error(`${err.name}: ${err.message}\n${err.stack}`);
});

['SIGINT', 'SIGTERM'].forEach((signal) => {
	process.on(signal, () => {
		Logger.warn(`Received ${signal} signal`);
		process.exit(0);
	});
});
