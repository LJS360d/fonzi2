import {
  GatewayIntentBits as intents,
  type ClientOptions
} from 'discord.js';

export const options: ClientOptions = {
	// allowedMentions: { parse: ['users', 'roles'] },
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
	// closeTimeout: 0,
	// failIfNotExists: true,
	/* jsonTransformer: (obj) => {
		console.log(obj);
		return obj;
	}, */
	// rest: { version: '10' },
	/* presence: {
		activities: [{ name: 'a dumb dev', type: ActivityType.Watching }],
		afk: false,
		status: 'online',
	}, */
  
};
