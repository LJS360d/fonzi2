import type { ApplicationCommandData } from 'discord.js';
import {
  ClientEvent,
  DiscordHandler,
  HandlerType,
  Logger,
} from '../../../dist';
import { assert } from 'vitest';

export default class ClientEventsHandler extends DiscordHandler {
  public readonly type = HandlerType.clientEvent;

  constructor(private commands: ApplicationCommandData[]) {
    super();
  }

  @ClientEvent('ready')
  async onReady() {
    // * Successful login
    Logger.info(`Logged in as ${this.client?.user?.tag}!`);

    Logger.info('Started refreshing application (/) commands.');
    try {
      await this.client?.application?.commands.set(this.commands);
      Logger.info('Successfully reloaded application (/) commands.');
      assert.equal(this.client?.user?.displayName, 'Fonzi 2');
      assert.notEqual(this.client?.application?.commands, undefined);
    } catch (err: any) {
      Logger.error('Failed to reload application (/) commands.');
      Logger.error(err);
      assert.equal(false, true);
    }
  }
}
