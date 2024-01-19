import { ChannelType } from 'discord.js';
import 'reflect-metadata';
import { Handler } from '../../base.handler';

type MessageType = keyof typeof ChannelType;

export type MessageEventMetadata = { type: ChannelType; method: Function };

const messageEventsKey = Symbol('message-event');
export function getMessageEventsMetadata(target: any): MessageEventMetadata[] {
	return Reflect.getOwnMetadata(messageEventsKey, Object.getPrototypeOf(target)) || [];
}

export function MessageEvent(type: MessageType): MethodDecorator {
	return function (target: Handler, _, descriptor: PropertyDescriptor): any {
		const messageEvents: MessageEventMetadata[] =
			Reflect.getOwnMetadata(messageEventsKey, target) || [];
		messageEvents.push({ type: ChannelType[type], method: descriptor.value });

		Reflect.defineMetadata(messageEventsKey, messageEvents, target);
	};
}
