import { Config } from './config.type';

export const DefaultConfig: Config = {
	logger: {
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
	},
};
