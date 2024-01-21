import { Client } from 'discord.js';

export abstract class Handler {
	public abstract readonly type: HandlerType;
	public client: Client<true>;

	constructor() {}
}

export enum HandlerType {
	commandInteraction = 'command-interaction',
	buttonInteraction = 'button-interaction',
	clientEvent = 'client-event',
	messageEvent = 'message-event',
}
