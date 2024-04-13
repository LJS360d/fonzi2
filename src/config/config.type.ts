import { LoggerConfig } from '../logger/config';
import { ServerConfig } from '../server/config';

export interface Config {
  logger: LoggerConfig;
  server: ServerConfig;
}
