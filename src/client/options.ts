import { type ClientOptions, GatewayIntentBits as intents } from 'discord.js';

export const options: ClientOptions = {
	intents: [
		// intents.AutoModerationConfiguration,
		// intents.AutoModerationExecution,
		// intents.DirectMessageReactions,
		intents.DirectMessageReactions,
		intents.DirectMessageTyping,
		intents.DirectMessages,
		// intents.GuildEmojisAndStickers,
		// intents.GuildIntegrations,
		// intents.GuildInvites,
		intents.GuildMembers,
		intents.GuildMessageReactions,
		intents.GuildMessageTyping,
		intents.GuildMessages,
		// intents.GuildModeration,
		// intents.GuildPresences,
		// intents.GuildScheduledEvents,
		// intents.GuildVoiceStates,
		// intents.GuildWebhooks,
		intents.Guilds,
		intents.MessageContent,
	],
};
