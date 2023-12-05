import { CacheType, CommandInteraction } from 'discord.js';
import { env } from '../../../lib/env';
import { DiscordEventsHandler } from '../../../types/handlers/base.handler';
import { Command } from '../../decorators/command.decorator';

export class CommandInteractionsHandler extends DiscordEventsHandler {

	@Command({ name: 'version', description: 'get the application version' })
	async handleVersion(interaction: CommandInteraction<CacheType>) {
		await interaction.reply(env.VERSION);
	}
}
