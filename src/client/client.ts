import { ChatInputCommandInteraction, Client, ClientOptions } from 'discord.js';
import { getEventsMetadata } from '../events/decorators/client.event.decorator';
import { getCommandsMetadata } from '../events/decorators/command.decorator';
import { Logger } from '../lib/logger';
import { Handler } from '../events/handlers/base.handler';
export default class Fonzi2Client extends Client {
	constructor(options: ClientOptions, handlers: Handler[]) {
		super(options);
		const clientEventHandlers = [];
		const commandInteractionHandlers = [];
		const buttonInteractionHandlers = [];
		handlers.forEach((handler) => {
			handler.client = this;
			switch (handler.type) {
				case 'client-event':
					clientEventHandlers.push(handler);
					break;
				case 'command-interaction':
					commandInteractionHandlers.push(handler);
					break;
				case 'button-interaction':
					buttonInteractionHandlers.push(handler);
					break;
			}
		});
		this.registerClientEventHandlers(clientEventHandlers);
		this.registerCommandInteractionsHandlers(commandInteractionHandlers);
		this.registerButtonInteractionsHandlers(buttonInteractionHandlers);
	}

	private registerClientEventHandlers(clientEventHandlers: Handler[]) {
		clientEventHandlers.forEach((handler) => {
			const clientEvents = getEventsMetadata(handler);
			for (const { event, method } of clientEvents) {
				this.on(event, method.bind(handler));
			}
		});
	}

	private registerCommandInteractionsHandlers(commandInteractionHandlers: Handler[]) {
		commandInteractionHandlers.forEach((handler) => {
			this.on('interactionCreate', (interaction) => {
				if (interaction.isChatInputCommand()) {
					const commandsMetadata = getCommandsMetadata(handler);
					const matchedCommand = commandsMetadata.find(
						({ command }) => interaction.commandName === command.name
					);
					if (matchedCommand) {
						const { method, command } = matchedCommand;
						Logger.info(
							`Received command /${command.name} from ${interaction.user.username} in ${interaction.guild.name}`
						);
						method.call(handler, interaction as ChatInputCommandInteraction);
					}
				}
			});
		});
	}

	private registerButtonInteractionsHandlers(buttonInteractionHandlers: Handler[]) {
		// TODO implement
	}
}
