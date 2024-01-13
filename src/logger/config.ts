import 'dotenv/config';
import { ConfigLoader } from '../config/config.loader';
import { LoggerConfig } from '../config/config.type';

export function getLoggerConfig(): LoggerConfig {
	const config = ConfigLoader.loadConfig();
	return config.logger;
}
