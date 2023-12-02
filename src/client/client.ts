import { ChatInputCommandInteraction, Client, ClientOptions } from 'discord.js';
import { getCommandsMetadata } from '../events/decorators/command.decorator';
import { CommandInteractionsHandler } from '../events/handlers/commands/commands.handler';
import { getEventsMetadata } from '../events/decorators/client.event.decorator';
import { ClientEventsHandler } from '../events/handlers/common/client.events.handler';
import { Logger } from '../log/logger';
export default class Fonzi2Client extends Client {
	constructor(
		options: ClientOptions,
		clientEventsHandler: ClientEventsHandler,
		commandInteractionsHandler: CommandInteractionsHandler
	) {
		super(options);
		// * inject client into handlers
		clientEventsHandler.client = this;
		commandInteractionsHandler.client = this;
		this.registerClientEventHandlers(clientEventsHandler);
		this.registerCommandInteractionsHandlers(commandInteractionsHandler);
	}

	private registerClientEventHandlers(clientEventsHandler: ClientEventsHandler) {
		// * Get annotated methods from clientEventsHandler
		const clientEvents = getEventsMetadata(clientEventsHandler);
		// * bind method to event
		for (const { event, method } of clientEvents) {
			this.on(event, method.bind(clientEventsHandler));
		}
	}

	private registerCommandInteractionsHandlers(
		commandInteractionsHandler: CommandInteractionsHandler
	) {
		// * Get annotated methods from commandInteractionsHandler
		const commandInteractions = getCommandsMetadata(commandInteractionsHandler);

		this.on('interactionCreate', (interaction) => {
			if (interaction.isChatInputCommand()) {
				const matchedCommand = commandInteractions.find(
					({ name }) => interaction.commandName === name
				);

				if (matchedCommand) {
					const { name, method } = matchedCommand;
					Logger.info(`Received command ${name} from ${interaction.user.username}`);
					method.call(
						commandInteractionsHandler,
						interaction as ChatInputCommandInteraction
					);
				}
			}
		});
	}
}
