import { Client, ClientOptions, Message } from 'discord.js';
import { Handler } from '../events/base.handler';
import { getButtonsMetadata } from '../events/decorators/button.interaction.dec';
import { getEventsMetadata } from '../events/decorators/client.event.dec';
import { getCommandsMetadata } from '../events/decorators/command.interaction.dec';
import { getMessageEventsMetadata } from '../events/decorators/message.dec';
import { Logger } from '../logger/logger';

export class Fonzi2Client extends Client {
	constructor(token: string, options: ClientOptions, handlers: Handler[]) {
		super(options);
		const clientEventHandlers: Handler[] = [];
		const messageEventHandlers: Handler[] = [];
		const commandInteractionHandlers: Handler[] = [];
		const buttonInteractionHandlers: Handler[] = [];
		handlers.forEach((handler) => {
			handler.client = this;
			switch (handler.type) {
				case 'client-event':
					clientEventHandlers.push(handler);
					break;
				case 'message-event':
					messageEventHandlers.push(handler);
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
		this.registerMessageEventHandlers(messageEventHandlers);
		this.registerCommandInteractionsHandlers(commandInteractionHandlers);
		this.registerButtonInteractionsHandlers(buttonInteractionHandlers);
		this.login(token);
	}

	private registerClientEventHandlers(handlers: Handler[]) {
		handlers.forEach((handler) => {
			const clientEvents = getEventsMetadata(handler);
			for (const { event, method } of clientEvents) {
				this.on(event, method.bind(handler));
			}
		});
	}

	private registerMessageEventHandlers(handlers: Handler[]) {
		handlers.forEach((handler) => {
			const clientEvents = getMessageEventsMetadata(handler);
			for (const { type, method } of clientEvents) {
				this.on('messageCreate', (message: Message<boolean>) => {
					if (message.channel.type === type) method.call(handler, message);
				});
			}
		});
	}

	private registerCommandInteractionsHandlers(handlers: Handler[]) {
		handlers.forEach((handler) => {
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

	private registerButtonInteractionsHandlers(handlers: Handler[]) {
		handlers.forEach((handler) => {
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
