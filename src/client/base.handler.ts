import { Client } from 'discord.js';

export abstract class DiscordHandler {
  public abstract readonly type: HandlerType;
  public client: Client<true>;
}

export enum HandlerType {
  commandInteraction = 'command-interaction',
  buttonInteraction = 'button-interaction',
  clientEvent = 'client-event',
  messageEvent = 'message-event',
}
