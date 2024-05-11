import type { LoggerConfig } from '../logger/config';
import type { ServerConfig } from '../server/config';

export interface Config {
  logger: LoggerConfig;
  server: ServerConfig;
}
