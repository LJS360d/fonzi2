import { Logger } from '../../../lib/logger';
import { DiscordEventsHandler } from '../../../types/handlers/base.handler';
import { ClientEvent } from '../../decorators/client.event.decorator';
import { Fonzi2Server } from '../../../server/server';
import { DecoratorsMetadataAccess } from '../../decorators/access';

export class ClientEventsHandler extends DiscordEventsHandler {
	@ClientEvent('ready')
	async onReady() {
		// * Successful login
		Logger.info(`Logged in as ${this.client?.user?.tag}!`);

		try {
			Logger.info('Started refreshing application (/) commands.');
			await this.client?.application?.commands.set(DecoratorsMetadataAccess.commands);
			Logger.info('Successfully reloaded application (/) commands.');
			new Fonzi2Server(this.client!).start();
		} catch (err: any) {
			Logger.error(err);
		}
	}
}
