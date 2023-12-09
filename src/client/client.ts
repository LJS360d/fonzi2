import { Client, ClientOptions } from 'discord.js';
import { getButtonsMetadata } from '../events/decorators/button.interaction.dec';
import { getEventsMetadata } from '../events/decorators/client.event.dec';
import { getCommandsMetadata } from '../events/decorators/command.interaction.dec';
import { Handler } from '../events/handlers/base.handler';
import { Logger } from '../lib/logger';
export default class Fonzi2Client extends Client {
	constructor(options: ClientOptions, handlers: Handler[]) {
		super(options);
		const clientEventHandlers: Handler[] = [];
		const commandInteractionHandlers: Handler[] = [];
		const buttonInteractionHandlers: Handler[] = [];
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
					const commands = getCommandsMetadata(handler);
					const match = commands.find(({ name }) => interaction.commandName === name);
					if (match) {
						const { method, name } = match;
						Logger.trace(
							`Received command /${name} from ${interaction.user.username} in ${interaction.guild?.name}`
						);
						method.call(handler, interaction);
					}
				}
			});
		});
	}

	private registerButtonInteractionsHandlers(buttonInteractionHandlers: Handler[]) {
		buttonInteractionHandlers.forEach((handler) => {
			this.on('interactionCreate', (interaction) => {
				if (interaction.isButton()) {
					const buttons = getButtonsMetadata(handler);
					const match = buttons.find(({ id }) => interaction.customId === id);

					if (match) {
						const { method, id } = match;
						Logger.trace(
							`Received button ${id} from ${interaction.user.username} in ${interaction.guild?.name}`
						);
						method.call(handler, interaction);
					}
				}
			});
		});
	}
}
