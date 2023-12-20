import { ChatInputCommandInteraction } from 'discord.js';
import { Buttons } from '../../../../src/components/buttons';
import { env } from '../../env';
import { Command } from '../../../../src/events/decorators/command.interaction.dec';
import { Handler, HandlersType } from '../../../../src/events/base.handler';
import { ActionRow } from '../../../../src/components/action-row';

export class CommandInteractionsHandler extends Handler {
	public readonly type = HandlersType.commandInteraction;
	@Command({ name: 'version', description: 'get the application version' })
	async handleVersion(interaction: ChatInputCommandInteraction) {
		void interaction.reply(env.VERSION);
	}

	@Command({ name: 'ping', description: 'pong' })
	async handlePing(interaction: ChatInputCommandInteraction) {
		const confirm = Buttons.confirm('confirm-ping');
		const cancel = Buttons.cancel('cancel-ping');

		void interaction.reply({
			content: 'Would you like to be ponged?',
			components: [ActionRow.actionRowData(cancel, confirm)],
		});
	}
}
