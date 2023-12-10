import { ChannelType, Message } from 'discord.js';
import { Logger } from '../../../lib/logger';
import { MessageEvent } from '../../decorators/message.dec';
import { Handler, HandlersType } from '../base.handler';

export class MessageHandler extends Handler {
	public readonly type = HandlersType.messageEvent;

	@MessageEvent(ChannelType.DM)
	onDirectMessage(message: Message<boolean>): void {
		Logger.debug(message.content);
	}

	@MessageEvent(ChannelType.GuildText)
	onGuildMessage(message: Message<boolean>): void {
		Logger.debug(message.content);
	}
}
