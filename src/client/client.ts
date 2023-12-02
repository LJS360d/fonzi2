import { ChatInputCommandInteraction, Client, ClientOptions } from 'discord.js';
import { getCommandsMetadata } from '../events/handlers/commands/command.decorator';
import { CommandInteractionsHandler } from '../events/handlers/commands/commands.handler';
import { getEventsMetadata } from '../events/handlers/common/client.event.decorator';
import { ClientEventsHandler } from '../events/handlers/common/client.events.handler';
export default class Fonzi2Client extends Client {
	ownerId: string;
	constructor(
		options: ClientOptions,
		ownerId: string,
		clientEventsHandler: ClientEventsHandler,
		commandInteractionsHandler: CommandInteractionsHandler
	) {
		super(options);
		this.ownerId = ownerId;
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
        for (const { name, method } of commandInteractions) {
					if (interaction.commandName === name) {            
						method.call(
							commandInteractionsHandler,
							interaction as ChatInputCommandInteraction
						);
					}
				}
			}
		});
	}
}
