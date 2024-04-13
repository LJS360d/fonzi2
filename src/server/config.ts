import { ConfigLoader } from '../config/config.loader';

export type ServerConfig = {
  dashboardRoute: string;
  discordAuthRoute: string;
  loginRoute: string;
  loginData: {
    redirectRoute: string;
    ownerIds: string[];
    oauth2url: string;
  };

  unauthorizedRedirect: boolean;
  unauthorizedRoute: string;

  notFoundRedirect: boolean;
  notFoundRoute: string;

  forbiddenRedirect: boolean;
  forbiddenRoute: string;

  port: number;
};

export function getServerConfig(): ServerConfig {
  const config = ConfigLoader.loadConfig();
  return config.server;
}
