import { Client, type ClientOptions, type Message } from 'discord.js';
import { type DiscordHandler, HandlerType } from './base.handler';
import { getButtonsMetadata } from './decorators/button.interaction.dec';
import { getEventsMetadata } from './decorators/client.event.dec';
import { getCommandsMetadata } from './decorators/command.interaction.dec';
import { getMessageEventsMetadata } from './decorators/message.dec';
import { Logger } from '../logger/logger';

export class Fonzi2Client extends Client {
  constructor(
    token: string,
    options: ClientOptions,
    handlers: DiscordHandler[]
  ) {
    super(options);
    const clientEventHandlers: DiscordHandler[] = [];
    const messageEventHandlers: DiscordHandler[] = [];
    const commandInteractionHandlers: DiscordHandler[] = [];
    const buttonInteractionHandlers: DiscordHandler[] = [];
    void this.login(token);
    handlers.forEach((handler) => {
      handler.client = this as Client<true>;
      switch (handler.type) {
        case HandlerType.clientEvent:
          clientEventHandlers.push(handler);
          break;
        case HandlerType.messageEvent:
          messageEventHandlers.push(handler);
          break;
        case HandlerType.commandInteraction:
          commandInteractionHandlers.push(handler);
          break;
        case HandlerType.buttonInteraction:
          buttonInteractionHandlers.push(handler);
          break;
      }
    });
    this.registerClientEventHandlers(clientEventHandlers);
    this.registerMessageEventHandlers(messageEventHandlers);
    this.registerCommandInteractionsHandlers(commandInteractionHandlers);
    this.registerButtonInteractionsHandlers(buttonInteractionHandlers);
  }

  private registerClientEventHandlers(handlers: DiscordHandler[]) {
    handlers.forEach((handler) => {
      const clientEvents = getEventsMetadata(handler);
      for (const { event, method } of clientEvents) {
        this.on(event, method.bind(handler));
      }
    });
  }

  private registerMessageEventHandlers(handlers: DiscordHandler[]) {
    handlers.forEach((handler) => {
      const clientEvents = getMessageEventsMetadata(handler);
      for (const { type, method } of clientEvents) {
        this.on('messageCreate', (message: Message<boolean>) => {
          if (message.channel.type === type) method.call(handler, message);
        });
      }
    });
  }

  private registerCommandInteractionsHandlers(handlers: DiscordHandler[]) {
    handlers.forEach((handler) => {
      this.on('interactionCreate', (interaction) => {
        if (interaction.isChatInputCommand()) {
          const commands = getCommandsMetadata(handler);
          const match = commands.find(
            ({ name }) => interaction.commandName === name
          );
          if (match) {
            const { method, name } = match;
            Logger.info(
              `Received command /${name} from ${interaction.user.username} in ${interaction.guild?.name}`
            );
            method.call(handler, interaction);
          }
        }
      });
    });
  }

  private registerButtonInteractionsHandlers(handlers: DiscordHandler[]) {
    handlers.forEach((handler) => {
      this.on('interactionCreate', (interaction) => {
        if (interaction.isButton()) {
          const buttons = getButtonsMetadata(handler);
          const match = buttons.find(({ id }) => interaction.customId === id);

          if (match) {
            const { method, id } = match;
            Logger.info(
              `Received button ${id} from ${interaction.user.username} in ${interaction.guild?.name}`
            );
            method.call(handler, interaction);
          }
        }
      });
    });
  }
}
