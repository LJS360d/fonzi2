import { Logger } from '../../../log/logger';
import { DiscordEventsHandler } from '../base.handler';
import { CommandInteractionsHandler } from '../commands/commands.handler';
import { ClientEvent } from '../../decorators/client.event.decorator';

export class ClientEventsHandler extends DiscordEventsHandler {
	@ClientEvent('ready')
	async onReady() {
		// * Successful login
		Logger.info(`Logged in as ${this.client?.user?.tag}!`);

		try {
			Logger.info('Started refreshing application (/) commands.');
			await this.client?.application?.commands.set(CommandInteractionsHandler.commands);
			Logger.info('Successfully reloaded application (/) commands.');
		} catch (err: any) {
			Logger.error(err);
		}
	}
}
