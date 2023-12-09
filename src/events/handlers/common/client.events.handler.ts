import { Logger } from '../../../lib/logger';
import { Handler, HandlersType } from '../base.handler';
import { ClientEvent } from '../../decorators/client.event.dec';
import { Fonzi2Server } from '../../../server/server';
import { ApplicationCommandData, Guild } from 'discord.js';

export class ClientEventsHandler extends Handler {
	public type = HandlersType.clientEvent;
	constructor(private commands: ApplicationCommandData[]) {
		super();
	}
	@ClientEvent('ready')
	async onReady() {
		// * Successful login
		Logger.info(`Logged in as ${this.client?.user?.tag}!`);

		try {
			Logger.info('Started refreshing application (/) commands.');
			void this.client?.application?.commands.set(this.commands);
			Logger.info('Successfully reloaded application (/) commands.');
			new Fonzi2Server(this.client!).start();
		} catch (err: any) {
			Logger.error(err);
		}
	}

	@ClientEvent('guildCreate')
	async onGuildCreate(guild: Guild) {
		Logger.info(`Joined guild ${guild.name}`);
    void guild.systemChannel?.send(`Hello ${guild.name}`);
	}

  @ClientEvent('guildDelete')
	async onGuildDelete(guild: Guild) {
		Logger.info(`Left guild ${guild.name}`);
	}

}
