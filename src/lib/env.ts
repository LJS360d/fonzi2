import 'dotenv/config';
import { BaseEnv } from '../types/env/base.env';
export const env = {
	// ! [REQUIRED] the discord bot's token
	TOKEN: process.env.TOKEN!,
	// ? [Recommended] a webhook for logs
	LOG_WEBHOOK: process.env.LOG_WEBHOOK,
	// ! [REQUIRED] OAuth2 credentials
	OAUTH2_URL: process.env.OAUTH2_URL!,
	OWNER_IDS: process.env.OWNER_IDS!.split(','),
	// * npm package version
	VERSION: process.env.npm_package_version!,
	// * the server's port (default: 8080)
	PORT: Number(process.env.PORT) || 8080,
	// * the current environment (default: development)
	NODE_ENV: (process.env.NODE_ENV || 'development') as
		| 'development'
		| 'staging'
    | 'test'
		| 'production',
} as BaseEnv;