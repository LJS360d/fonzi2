import { ApplicationCommandData } from 'discord.js';
import { ClientEvent, Handler, HandlerType, Logger } from '../../../src';
import { assert } from 'vitest';

export default class ClientEventsHandler extends Handler {
  public readonly type = HandlerType.clientEvent;

  constructor(private commands: ApplicationCommandData[]) {
    super();
  }

  @ClientEvent('ready')
  async onReady() {
    // * Successful login
    Logger.info(`Logged in as ${this.client?.user?.tag}!`);

    const loading = Logger.loading('Started refreshing application (/) commands.');
    try {
      await this.client?.application?.commands.set(this.commands);
      loading.success('Successfully reloaded application (/) commands.');
      assert.equal(this.client?.user?.displayName, 'Fonzi 2');
      assert.notEqual(this.client?.application?.commands, undefined);
    } catch (err: any) {
      loading.fail('Failed to reload application (/) commands.');
      Logger.error(err);
      assert.equal(false, true);
    }
  }
}
