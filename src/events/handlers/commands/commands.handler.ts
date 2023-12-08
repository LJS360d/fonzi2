import { ChatInputCommandInteraction } from 'discord.js';
import { env } from '../../../lib/env';
import { Handler, HandlersType } from '../base.handler';
import { Command } from '../../decorators/command.decorator';

export class CommandInteractionsHandler extends Handler {
  public type = HandlersType.commandInteraction;
	@Command({ name: 'version', description: 'get the application version' })
	async handleVersion(interaction: ChatInputCommandInteraction) {
		await interaction.reply(env.VERSION);
	}
}
