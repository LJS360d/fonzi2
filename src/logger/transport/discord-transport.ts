import axios from 'axios';
import {
  Colors,
  EmbedBuilder,
  type Client,
  type TextChannel,
} from 'discord.js';
import Transport, { type TransportStreamOptions } from 'winston-transport';

interface WinstonLogInfo {
  level: string;
  message: string;
  timestamp: string;
  discord?: boolean;
  meta?: Record<string, string>;
  error?: Error;
  [x: symbol]: string;
}

export interface BaseDiscordTransportOptions extends TransportStreamOptions {
  defaultMeta?: Record<string, string>;
}
export abstract class BaseDiscordTransport extends Transport {
  protected defaultMeta?: Record<string, string>;
  public colorsMap: Map<string, number> = new Map<string, number>([
    ['error', Colors.Red],
    ['warn', Colors.Yellow],
    ['info', Colors.Green],
    ['verbose', Colors.Yellow],
    ['debug', Colors.Purple],
    ['silly', Colors.DarkVividPink],
    ['fatal', Colors.NotQuiteBlack],
    ['trace', Colors.Aqua],
  ]);

  constructor(opts: BaseDiscordTransportOptions) {
    super(opts);
    this.defaultMeta = opts.defaultMeta;
  }

  override log(info: WinstonLogInfo, callback: () => void) {
    if (info.discord !== false) {
      setImmediate(() => {
        this.sendToDiscord(info).catch((err) => {
          console.error('Error sending message to discord', err);
        });
      });
    }
    callback();
  }

  protected buildEmbed(log: WinstonLogInfo) {
    const level = log[Symbol.for('level')];
    const { message, timestamp } = log;
    const color = this.colorsMap.get(level) ?? Colors.Default;
    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(process.env['NODE_ENV'] ?? 'UNKNOWN_ENV')
      .setDescription(`**${level.toUpperCase()}**`)
      .addFields({
        name: ' ',
        value: message,
        inline: true,
      })
      .setFooter({ text: timestamp });
    return embed;
  }

  protected buildRequestBody(info: WinstonLogInfo) {
    const embed = this.buildEmbed(info);
    const body: Record<string, unknown> = { embeds: [embed] };

    if (info.level === 'error' && info.error && info.error.stack) {
      body['content'] = `\`\`\`${info.error.stack}\`\`\``;
    }

    if (this.defaultMeta) {
      for (const [name, value] of Object.entries(this.defaultMeta)) {
        body['embeds']![0].data.fields.push({ name, value });
      }
    }

    if (info.meta) {
      for (const [name, value] of Object.entries(info.meta)) {
        body['embeds']![0].data.fields.push({ name, value });
      }
    }
    return body;
  }

  abstract sendToDiscord(info: WinstonLogInfo): Promise<void>;
}

export interface DiscordChannelTransportOptions
  extends BaseDiscordTransportOptions {
  client: Client<true>;
  channelId: string;
}
export class DiscordChannelTransport extends BaseDiscordTransport {
  private client: Client<true>;
  private channelId: string;

  constructor({ client, channelId, ...opts }: DiscordChannelTransportOptions) {
    super(opts);
    this.client = client;
    this.channelId = channelId;
  }

  override async sendToDiscord(info: WinstonLogInfo) {
    const body = this.buildRequestBody(info);
    const channel = (await this.client.channels.fetch(
      this.channelId
    )) as TextChannel;
    void channel.send(JSON.stringify(body));
  }
}

export interface DiscordWebhookTransportOptions
  extends BaseDiscordTransportOptions {
  webhook: string;
}
export class DiscordWebhookTransport extends BaseDiscordTransport {
  private webhook: string;

  constructor({ webhook, ...opts }: DiscordWebhookTransportOptions) {
    super(opts);
    this.webhook = webhook;
  }

  override async sendToDiscord(info: WinstonLogInfo) {
    const body = this.buildRequestBody(info);
    await axios.post(this.webhook, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
