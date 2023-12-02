import 'reflect-metadata';
import { ApplicationCommandDataResolvable } from 'discord.js';

export const commandMetadataKey = Symbol('commandMetadata');
export const commandObjectsKey = Symbol('commandObjects');

type CommandsMetadata = { name: string; method: Function }[];
export function getCommandsMetadata(target: any): CommandsMetadata {
	return Reflect.getOwnMetadata(commandMetadataKey, Object.getPrototypeOf(target)) || [];
}

export function Command(command: ApplicationCommandDataResolvable): MethodDecorator {
	return (target: any, key: string | symbol, descriptor: PropertyDescriptor) => {
		// ? classic "name,method" tuple
		const commandMetadata: CommandsMetadata =
			Reflect.getOwnMetadata(commandMetadataKey, target) || [];
		commandMetadata.push({ name: (command as any).name, method: descriptor.value });
		Reflect.defineMetadata(commandMetadataKey, commandMetadata, target);

		// ? array of commands data for declaration
		const commandObjects: ApplicationCommandDataResolvable[] =
			Reflect.getOwnMetadata(commandObjectsKey, target) || [];
		commandObjects.push(command);
		Reflect.defineMetadata(commandObjectsKey, commandObjects, target);
	};
}
