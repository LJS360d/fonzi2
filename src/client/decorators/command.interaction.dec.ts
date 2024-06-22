import 'reflect-metadata';
import type { ApplicationCommandData } from 'discord.js';
import { type DiscordHandler, HandlerType } from '../base.handler';

type CommandInteractionMetadata = {
  name: string;
  method: Function;
};

const commandsKey = Symbol(HandlerType.commandInteraction);

export function getRegisteredCommands(): ApplicationCommandData[] {
  return Reflect.getOwnMetadata(commandsKey, global) || [];
}

export function getCommandsMetadata(target: any): CommandInteractionMetadata[] {
  return (
    Reflect.getOwnMetadata(commandsKey, Object.getPrototypeOf(target)) || []
  );
}

// ? @Command decorator
export function Command(command: ApplicationCommandData): MethodDecorator {
  return (target: DiscordHandler, _, descriptor: PropertyDescriptor) => {
    const method: Function = descriptor.value;
    const commandMetadata = Reflect.getOwnMetadata(commandsKey, target) || [];
    commandMetadata.push({ method, name: command.name });
    const commands = getRegisteredCommands();
    commands.push(command);
    Reflect.defineMetadata(commandsKey, commandMetadata, target);
    Reflect.defineMetadata(commandsKey, commands, global);
  };
}
