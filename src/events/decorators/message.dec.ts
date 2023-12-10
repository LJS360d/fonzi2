import 'reflect-metadata';
import { ChannelType } from 'discord.js';
import { Handler } from '../handlers/base.handler';

export type MessageEventMetadata = { event: ChannelType; method: Function };

const messageEventsKey = Symbol('message-event');
export function getMessageEventsMetadata(target: any): MessageEventMetadata[] {
	return Reflect.getOwnMetadata(messageEventsKey, Object.getPrototypeOf(target)) || [];
}

export function MessageEvent(event: ChannelType): MethodDecorator {
	return (target: Handler, _, descriptor: PropertyDescriptor) => {
		const messageEvents: MessageEventMetadata[] =
			Reflect.getOwnMetadata(messageEventsKey, target) || [];
		messageEvents.push({ event, method: descriptor.value });

		Reflect.defineMetadata(messageEventsKey, messageEvents, target);
	};
}
