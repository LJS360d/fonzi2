import 'dotenv/config';
import { ConfigLoader } from '../config/config.loader';

export type LoggerConfig = Readonly<{
  enabled: boolean;
  pattern: string;
  levels: LoggerLevels;
  remote: {
    enabled: boolean;
    webhook?: string;
    levels: LoggerLevels;
  };
  file: {
    enabled: boolean;
    path: string;
    levels: LoggerLevels;
  };
}>;
export type LoggerLevels = 'all' | LoggerLevel[];
export type LoggerLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'TRACE' | 'LOAD';

export function getLoggerConfig(): LoggerConfig {
  const config = ConfigLoader.loadConfig();
  return config.logger;
}
