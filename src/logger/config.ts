import 'dotenv/config';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

export type LoggerConfig = Readonly<{
	enabled: boolean;
	pattern: string;
	levels: 'all' | LoggerLevel[];
	remote: {
		enabled: boolean;
		webhook?: string;
		levels: 'all' | LoggerLevel[];
	};
	file: {
		enabled: boolean;
		path: string;
		levels: 'all' | LoggerLevel[];
	};
}>;

export type LoggerLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'TRACE' | 'LOAD';

const defaultConfig: LoggerConfig = {
	enabled: true,
	pattern: `#gray[%time]$ %color%level$ #white%msg$`,
	levels: 'all',
	remote: {
		enabled: true,
		webhook: process.env['LOG_WEBHOOK'],
		levels: 'all',
	},
	file: {
		enabled: true,
		path: 'logs',
		levels: 'all',
	},
};
// TODO make configurable from external file
export function getLoggerConfig(): LoggerConfig {
	const configFilepath = resolve('fonzi2.logger.config.json');
	if (existsSync(configFilepath)) {
		const fileContent = readFileSync(configFilepath, 'utf8');
		try {
			const parsedConfig = JSON.parse(fileContent);
			const mergedConfig = mergeConfigs(defaultConfig, parsedConfig);
			return mergedConfig;
		} catch (error) {
			console.error('Error parsing logger config file:', error);
			process.exit(1);
		}
	}

	return { ...defaultConfig };
}

function mergeConfigs(strictConfig: LoggerConfig, anyConfig: any): LoggerConfig {
	const mergedConfig = {
		...strictConfig,
		...anyConfig,
		remote: { ...strictConfig.remote, ...anyConfig.remote },
		file: { ...strictConfig.file, ...anyConfig.file },
	};

	return mergedConfig;
}
