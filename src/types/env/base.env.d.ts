export type BaseEnv = Readonly<{
	TOKEN: string;
	LOG_WEBHOOK: string | undefined;
	OAUTH2_URL: string;
	OWNER_IDS: string[];
	PORT: number;
	VERSION: string;
	NODE_ENV: 'development' | 'staging' | 'test' | 'production';
}>;
