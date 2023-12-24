import 'dotenv/config';

export type LoggerConfig = Readonly<{
	enabled: boolean;
	pattern: string;
	levels: 'all' | LoggerLevel[];
	remote: {
		enabled: boolean;
		webhook?: string;
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
};
// TODO make configurable from external file
export function getLoggerConfig(): LoggerConfig {
	return { ...defaultConfig };
}
