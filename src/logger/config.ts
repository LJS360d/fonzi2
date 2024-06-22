import 'dotenv/config';
import { ConfigLoader } from '../config/config.loader';
import type {
  ConsoleTransportOptions,
  FileTransportOptions,
} from 'winston/lib/winston/transports';
import type { DiscordWebhookTransportOptions } from './transport/discord-transport';
import type { LoggerOptions } from 'winston';

export type LoggerConfig = Readonly<{
  options?: LoggerOptions;
  console?: ConsoleTransportOptions;
  remote?: DiscordWebhookTransportOptions;
  file?: FileTransportOptions;
}>;
export type LoggerLevels = 'all' | LoggerLevel[];
export type LoggerLevel =
  | 'ERROR'
  | 'WARN'
  | 'INFO'
  | 'HTTP'
  | 'DEBUG'
  | 'SILLY';

export function getLoggerConfig(): LoggerConfig {
  const config = ConfigLoader.loadConfig();
  return config.logger;
}
