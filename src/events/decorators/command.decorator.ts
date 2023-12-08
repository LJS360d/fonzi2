import 'reflect-metadata';
import { ApplicationCommandData } from 'discord.js';
import { Handler } from '../handlers/base.handler';

type CommandInteractionMetadata = {
	method: Function;
	command: ApplicationCommandData;
};
const commandMetadataKey = Symbol('commandsMetadata');

export function getRegisteredCommands(): ApplicationCommandData[] {
	return Reflect.getOwnMetadata(commandMetadataKey, global) || [];
}

export function getCommandsMetadata(target: any): CommandInteractionMetadata[] {
	return Reflect.getOwnMetadata(commandMetadataKey, Object.getPrototypeOf(target)) || [];
}

// ? @Command decorator
export function Command(command: ApplicationCommandData): MethodDecorator {
	return (
		target: Handler,
		key: string | symbol,
		descriptor: PropertyDescriptor
	) => {
		const method: Function = descriptor.value;
		const commandMetadata = getCommandsMetadata(target);
		commandMetadata.push({ method, command });
		const commands = getRegisteredCommands();
		commands.push(command);
		Reflect.defineMetadata(commandMetadataKey, commandMetadata, target);
		Reflect.defineMetadata(commandMetadataKey, commands, global);
	};
}
