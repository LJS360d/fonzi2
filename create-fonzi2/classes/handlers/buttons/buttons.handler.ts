import { ButtonInteraction } from 'discord.js';
import { Button } from '../../../../src/events/decorators/button.interaction.dec';
import { Handler, HandlersType } from '../../../../src/events/base.handler';

export class ButtonInteractionHandler extends Handler {
	public readonly type = HandlersType.buttonInteraction;

	@Button('confirm-ping')
	public async confirmPing(interaction: ButtonInteraction) {
		void interaction.message.delete();
		void interaction.channel?.send('Pong!');
	}

	@Button('cancel-ping')
	public async cancelPing(interaction: ButtonInteraction) {
		void interaction.message.delete();
		void interaction.channel?.send('no pong :(');
	}
}
