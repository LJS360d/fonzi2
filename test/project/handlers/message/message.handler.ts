import { ChannelType, Message } from 'discord.js';
import { Logger } from '../../../../src/lib/logger/logger';
import { MessageEvent } from '../../../../src/events/decorators/message.dec';
import { Handler, HandlersType } from '../../../../src/events/base.handler';

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
