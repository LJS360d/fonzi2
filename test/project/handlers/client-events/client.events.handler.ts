import { ApplicationCommandData, Guild } from 'discord.js';
import { Logger } from '../../../../src/lib/logger/logger';
import { Fonzi2Server } from '../../../../src/server/server';
import { ClientEvent } from '../../../../src/events/decorators/client.event.dec';
import { Handler, HandlersType } from '../../../../src/events/base.handler';
import { env } from '../../env';

export class ClientEventsHandler extends Handler {
	public readonly type = HandlersType.clientEvent;
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
			new Fonzi2Server(this.client!, {
				port: env.PORT,
				inviteLink: env.INVITE_LINK,
				oauth2url: env.OAUTH2_URL,
				ownerIds: env.OWNER_IDS,
				version: env.VERSION,
			}).start();
		} catch (err: any) {
			loading.fail('Failed to reload application (/) commands.');
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
