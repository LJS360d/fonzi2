import { createLogger, transports } from 'winston';
import type TransportStream from 'winston-transport';
import { getLoggerConfig } from './config';
import { DiscordWebhookTransport } from './transport/discord-transport';

const { options, ...transportOptions } = getLoggerConfig();
const _transports: TransportStream[] = [
  transportOptions.console
    ? new transports.Console(transportOptions.console)
    : undefined,
  transportOptions.file
    ? new transports.File(transportOptions.file)
    : undefined,
  transportOptions.remote
    ? new DiscordWebhookTransport(transportOptions.remote)
    : undefined,
].filter((t) => t !== undefined) as TransportStream[];

export const Logger = createLogger({
  ...options,
  transports: [..._transports],
});
