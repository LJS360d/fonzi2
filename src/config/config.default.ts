import type { Config } from './config.type';
import { format } from 'winston';
const { combine, timestamp, printf, colorize, align } = format;

import 'dotenv/config';
export const DefaultConfig: Config = {
  server: {
    loginData: {
      redirectRoute: '/dashboard',
      ownerIds: process.env['OWNER_IDS']
        ? process.env['OWNER_IDS'].split(',')
        : [],
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
    options: {
      levels: {
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        verbose: 5,
        debug: 6,
        silly: 7,
      },
      format: combine(
        format((info) => {
          info.level = info.level.trim().toUpperCase();
          return info;
        })(),
        colorize({
          level: true,
          message: false,
          colors: {
            error: 'red',
            warn: 'yellow',
            info: 'green',
            http: 'green',
            verbose: 'yellow',
            debug: 'magenta',
            silly: 'magenta',
          },
        }),
        timestamp({
          format: 'DD/MM/YYYY, HH:mm:ss',
        }),
        align(),
        printf(
          (info) =>
            `\x1b[37m[${info['timestamp']}] ${info.level}${info.message}`
        )
      ),
    },
    console: {
      stderrLevels: ['error'],
      debugStdout: true,
      level: 'silly',
    },
    file: {
      filename: 'logs/error.log',
      level: 'error',
    },
    remote: process.env['LOG_WEBHOOK']
      ? {
          webhook: process.env['LOG_WEBHOOK']!,
          silent: false,
          level: 'silly',
        }
      : undefined,
  },
};
