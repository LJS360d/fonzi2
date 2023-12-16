import axios from 'axios';
import { EmbedBuilder } from 'discord.js';
import {
	CC,
	DC,
	textBackgroundReplaceMap,
	textColorReplaceMap,
	textStyleReplaceMap,
} from './colors';
import { LoggerLevel, getLoggerConfig } from './config';
import { capitalize, now } from './utils';

export class Logger {
	protected static readonly config = getLoggerConfig();

	public static info(msg: string | object): void {
		this.log('INFO', 'green', msg);
	}

	public static trace(msg: string | object): void {
		this.log('TRACE', 'cyan', msg);
	}

	public static debug(msg: string | object): void {
		this.log('DEBUG', 'magenta', msg);
	}

	public static warn(msg: string | object): void {
		this.log('WARN', 'yellow', msg);
	}

	public static error(msg: string | object): void {
		this.log('ERROR', 'red', msg);
	}

	public static loading(startMsg: string) {
		const frames = ['|', '/', '-', '\\'];
		const level = 'LOAD';
		const color = 'magenta';
		let i = 0;
		let loader: NodeJS.Timeout;
		let isLoading = false;
		let msg = startMsg;

		const disabled =
			!this.config.enabled ||
			(this.config.levels !== 'all' && !this.config.levels.includes(level));

		const remoteDisabled =
			!this.config.remote.enabled ||
			(this.config.remote.levels !== 'all' && !this.config.remote.levels.includes(level));

		const updatePattern = (endSeq?: string) => {
			const frame = frames[i++];
			const nextMsg = `${endSeq || frame} ${msg}`;
			i %= frames.length;
			return this.applyStyle(this.applyData(nextMsg, level, color));
		};
		const anim = (endSeq?: string) => {
			if (!isLoading) {
				// Start the loading animation
				isLoading = true;
				loader = setInterval(() => {
					if (!disabled) process.stdout.write(`${updatePattern()}\r`);
				}, 100);
			} else {
				// Stop the loading animation
				clearInterval(loader);
				if (!disabled) process.stdout.write(`${updatePattern(endSeq)}\n`);
				if (!remoteDisabled)
					this.remoteLog(level, color, `${endSeq?.at(-2) || ''} ${msg}`);
				isLoading = false;
			}
		};

		anim();
		return {
			update: (newMsg: string) => {
				msg = newMsg;
			},
			success: (successMsg: string) => {
				msg = successMsg;
				anim(`#green✓$`);
			},
			fail: (failMsg: string) => {
				msg = failMsg;
				anim(`#red✗$`);
			},
			abort: (abortMsg?: string) => {
				msg = abortMsg || 'Loading was aborted';
				anim(`#yellow—$`);
			},
		};
	}

	private static log(
		level: LoggerLevel,
		color: keyof typeof CC,
		msg: string | object
	): void {
		if (this.config.levels !== 'all' && !this.config.levels.includes(level)) return;

		if (typeof msg !== 'string') {
			msg = JSON.stringify(msg, null, 2);
		}
		const text = this.applyStyle(this.applyData(msg, level, color));
		if (this.config.enabled) {
			console.log(text);
		}

		if (this.config.remote.enabled) {
			this.remoteLog(level, color as keyof typeof DC, msg);
		}
	}

	private static remoteLog(level: LoggerLevel, color: keyof typeof DC, msg: string) {
		const embed = new EmbedBuilder()
			.setColor(DC[color] ?? DC.white)
			.setDescription(now())
			.addFields({
				name: `${capitalize(process.env['NODE_ENV']!)} ${level}`,
				value: this.stripStyle(msg),
				inline: true,
			});
		const body = JSON.stringify({ embeds: [embed] });

		try {
			if (this.config.remote.webhook)
				axios.post(this.config.remote.webhook, body, {
					headers: {
						'Content-Type': 'application/json',
					},
				});
		} catch (error: any) {
      // ignore 429 error response
			if (error.response && error.response.status === 429) {
				return;
			}
		}
	}

	private static stripStyle(str: string) {
		return this.applyStyle(str).replace(/\x1b\[[0-9;]*m/g, '');
	}

	private static applyStyle(text: string): string {
		if (['&', '#', '£', '$'].some((char) => text.includes(char))) {
			const applyMap = (text: string, map: Map<string, string>, prefix: string) => {
				if (text.includes(prefix)) {
					for (const [key, value] of map) {
						text = text.replace(new RegExp(key, 'g'), value);
					}
				}
				return text;
			};

			text = applyMap(text, textStyleReplaceMap, '&');
			text = applyMap(text, textColorReplaceMap, '#');
			text = applyMap(text, textBackgroundReplaceMap, '£');
			return text.replace(/\$/g, CC.stop);
		}
		return text;
	}

	private static applyData(msg: string, level: string, color: keyof typeof CC) {
		return this.config.pattern
			.replace('%time', now())
			.replace('%level', level)
			.replace('%msg', msg)
			.replace('%color', `#${color}`);
	}
}
