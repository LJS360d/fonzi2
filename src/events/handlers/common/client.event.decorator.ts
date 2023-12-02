import 'reflect-metadata';
import { ClientEvents } from 'discord.js';

export const clientEventsKey = Symbol('clientEvents');

export type ClientEventsMetadata = { event: keyof ClientEvents; method: Function }[];

export function getEventsMetadata(target: any): ClientEventsMetadata {
	return Reflect.getOwnMetadata(clientEventsKey, Object.getPrototypeOf(target));
}

export function ClientEvent(event: keyof ClientEvents): MethodDecorator {
	return (target: any, key: string | symbol, descriptor: PropertyDescriptor) => {
		const clientEvents: ClientEventsMetadata =
			Reflect.getOwnMetadata(clientEventsKey, target) || [];
		clientEvents.push({ event, method: descriptor.value });

		Reflect.defineMetadata(clientEventsKey, clientEvents, target);
	};
}
