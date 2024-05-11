import type { Client } from 'discord.js';
import type express from 'express';

export abstract class ServerController {
  public app: express.Application;
  public client: Client<true>;

  public setup(app: express.Application, client: Client<true>) {
    this.app = app;
    this.client = client;
  }
}
