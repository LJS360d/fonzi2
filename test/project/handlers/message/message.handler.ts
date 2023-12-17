import { Message } from 'discord.js';
import { Handler, HandlersType } from '../../../../src/events/base.handler';
import { MessageEvent } from '../../../../src/events/decorators/message.dec';
import { Logger } from '../../../../src/lib/logger/logger';

export class MessageHandler extends Handler {
	public readonly type = HandlersType.messageEvent;

	@MessageEvent('DM')
	onDirectMessage(message: Message<boolean>): void {
		Logger.debug(message.content);
	}

	@MessageEvent('GuildText')
	onGuildMessage(message: Message<boolean>): void {
		Logger.debug(message.content);
	}
}
