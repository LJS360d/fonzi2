import { error, info } from '../../../log/logging';
import { DiscordEventsHandler } from '../base.handler';
import { CommandInteractionsHandler } from '../commands/commands.handler';
import { ClientEvent } from './client.event.decorator';

export class ClientEventsHandler extends DiscordEventsHandler {
	@ClientEvent('ready')
	async onReady() {
		// * Successful login
		info(`Logged in as ${this.client?.user?.tag}!`);

		try {
			info('Started refreshing application (/) commands.');
			await this.client?.application?.commands.set(CommandInteractionsHandler.commands);
			info('Successfully reloaded application (/) commands.');
		} catch (err: any) {
			error(err);
		}
	}

	@ClientEvent('messageCreate')
	async onMessageCreate() {
		console.log('palle');
	}
}
