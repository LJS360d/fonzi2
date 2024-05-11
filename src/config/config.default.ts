import type { Config } from './config.type';
import 'dotenv/config';
export const DefaultConfig: Config = {
  server: {
    loginData: {
      redirectRoute: '/dashboard',
      ownerIds: process.env['OWNER_IDS'] ? process.env['OWNER_IDS'].split(',') : [],
      oauth2url: process.env['OAUTH2_URL']!,
    },
    discordAuthRoute: '/',
    dashboardRoute: '/dashboard',
    loginRoute: '/login',
    unauthorizedRedirect: true,
    unauthorizedRoute: '/unauthorized',
    notFoundRedirect: true,
    notFoundRoute: '/notfound',
    forbiddenRedirect: false,
    forbiddenRoute: '/forbidden',
    port: Number(process.env['PORT']) || 8080,
  },
  logger: {
    enabled: true,
    pattern: '#gray[%time]$ %color%level$ #white%msg$',
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
