import 'reflect-metadata';
import type { ClientEvents } from 'discord.js';
import { type DiscordHandler, HandlerType } from '../base.handler';

type ClientEvent = keyof Omit<ClientEvents, 'messageCreate' | 'debug'>;

export type ClientEventMetadata = { event: ClientEvent; method: Function };

const clientEventsKey = Symbol(HandlerType.clientEvent);
export function getEventsMetadata(target: any): ClientEventMetadata[] {
  return Reflect.getOwnMetadata(clientEventsKey, Object.getPrototypeOf(target)) || [];
}

export function ClientEvent(event: ClientEvent): MethodDecorator {
  return (target: DiscordHandler, _, descriptor: PropertyDescriptor) => {
    const clientEvents: ClientEventMetadata[] =
      Reflect.getOwnMetadata(clientEventsKey, target) || [];
    clientEvents.push({ event, method: descriptor.value });
    Reflect.defineMetadata(clientEventsKey, clientEvents, target);
  };
}
