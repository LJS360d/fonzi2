import { CacheType, CommandInteraction } from 'discord.js';
import { DiscordEventsHandler } from '../base.handler';
import { Command, commandObjectsKey } from '../../decorators/command.decorator';
import { env } from '../../../main';

export class CommandInteractionsHandler extends DiscordEventsHandler {
	static get commands() {
		return (
			Reflect.getOwnMetadata(commandObjectsKey, CommandInteractionsHandler.prototype) ||
			[]
		);
	}

	@Command({ name: 'version', description: 'get the application version' })
	async handleVersion(interaction: CommandInteraction<CacheType>) {
		await interaction.reply(env.VERSION);
	}
}
