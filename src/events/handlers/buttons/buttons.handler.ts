import { ButtonInteraction } from 'discord.js';
import { Button } from '../../decorators/button.interaction.dec';
import { Handler, HandlersType } from '../base.handler';

export class ButtonInteractionHandler extends Handler {
	public readonly type = HandlersType.buttonInteraction;

	@Button('confirm-ping')
	public async confirmPing(interaction: ButtonInteraction) {
		await interaction.reply('Pong!');
	}

  @Button('cancel-ping')
	public async cancelPing(interaction: ButtonInteraction) {
		await interaction.reply('no pong :(');
	}
}
