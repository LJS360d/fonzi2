import 'reflect-metadata';
import { ClientEvents } from 'discord.js';


export type ClientEventMetadata = { event: keyof ClientEvents; method: Function };

const clientEventsKey = Symbol('clientEvents');
export function getEventsMetadata(target: any): ClientEventMetadata[] {
	return Reflect.getOwnMetadata(clientEventsKey, Object.getPrototypeOf(target)) || [];
}

export function ClientEvent(event: keyof ClientEvents): MethodDecorator {
	return (target: any, key: string | symbol, descriptor: PropertyDescriptor) => {
		const clientEvents: ClientEventMetadata[] =
			Reflect.getOwnMetadata(clientEventsKey, target) || [];
		clientEvents.push({ event, method: descriptor.value });

		Reflect.defineMetadata(clientEventsKey, clientEvents, target);
	};
}
