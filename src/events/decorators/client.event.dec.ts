import 'reflect-metadata';
import { ClientEvents } from 'discord.js';
import { Handler } from '../handlers/base.handler';

export type ClientEventMetadata = { event: keyof ClientEvents; method: Function };

const eventsKey = Symbol('client-event');
export function getEventsMetadata(target: any): ClientEventMetadata[] {
	return Reflect.getOwnMetadata(eventsKey, Object.getPrototypeOf(target)) || [];
}

export function ClientEvent(event: keyof ClientEvents): MethodDecorator {
	return (target: Handler, _, descriptor: PropertyDescriptor) => {
		const clientEvents: ClientEventMetadata[] =
			Reflect.getOwnMetadata(eventsKey, target) || [];
		clientEvents.push({ event, method: descriptor.value });

		Reflect.defineMetadata(eventsKey, clientEvents, target);
	};
}
