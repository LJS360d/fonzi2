import axios from 'axios';
import { EmbedBuilder } from 'discord.js';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  CC,
  DC,
  textBackgroundReplaceMap,
  textColorReplaceMap,
  textStyleReplaceMap,
} from './colors';
import { type LoggerLevel, getLoggerConfig } from './config';
import { capitalize, now } from './utils';

export class Logger {
  protected static readonly config = getLoggerConfig();
  protected static readonly startupTimestamp = String(Date.now());
  private static readonly fileEncoding = 'utf-8';

  public static info(msg: string | object): void {
    Logger.log('INFO', 'green', msg);
  }

  public static trace(msg: string | object): void {
    Logger.log('TRACE', 'cyan', msg);
  }

  public static debug(msg: string | object): void {
    Logger.log('DEBUG', 'magenta', msg);
  }

  public static warn(msg: string | object): void {
    Logger.log('WARN', 'yellow', msg);
  }

  public static error(msg: string | object): void {
    Logger.log('ERROR', 'red', msg);
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
      !Logger.config.enabled ||
      (Logger.config.levels !== 'all' && !Logger.config.levels.includes(level));

    const remoteDisabled =
      !Logger.config.remote.enabled ||
      (Logger.config.remote.levels !== 'all' && !Logger.config.remote.levels.includes(level));

    const fileDisabled =
      !Logger.config.file.enabled ||
      (Logger.config.file.levels !== 'all' && !Logger.config.file.levels.includes(level));

    const updatePattern = (endSeq?: string) => {
      const frame = frames[i++];
      const nextMsg = `${endSeq || frame} ${msg}`;
      i %= frames.length;
      return Logger.applyStyle(Logger.applyData(nextMsg, level, color));
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
        if (!remoteDisabled) Logger.remoteLog(level, color, `${endSeq?.at(-2) || ''} ${msg}`);
        if (!fileDisabled) Logger.fileLog(level, color, `${endSeq?.at(-2) || ''} ${msg}`);
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
        anim('#green✓$');
      },
      fail: (failMsg: string) => {
        msg = failMsg;
        anim('#red✗$');
      },
    };
  }

  private static log(level: LoggerLevel, color: keyof typeof CC, msg: string | object): void {
    if (Logger.config.levels !== 'all' && !Logger.config.levels.includes(level)) return;

    if (typeof msg !== 'string') {
      msg = JSON.stringify(msg, null, 2);
    }
    const text = Logger.applyStyle(Logger.applyData(msg, level, color));
    if (Logger.config.enabled) {
      console.log(text);
    }

    if (Logger.config.remote.enabled) {
      Logger.remoteLog(level, color as keyof typeof DC, msg);
    }

    if (Logger.config.file.enabled) {
      Logger.fileLog(level, color as keyof typeof DC, msg);
    }
  }

  private static remoteLog(level: LoggerLevel, color: keyof typeof DC, msg: string) {
    const embed = new EmbedBuilder()
      .setColor(DC[color] ?? DC.white)
      .setDescription(now())
      .addFields({
        name: `${capitalize(process.env['NODE_ENV']!)} ${level}`,
        value: Logger.stripStyle(msg),
        inline: true,
      });
    const body = JSON.stringify({ embeds: [embed] });

    try {
      if (Logger.config.remote.webhook)
        axios.post(Logger.config.remote.webhook, body, {
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

  private static fileLog(level: LoggerLevel, color: keyof typeof DC, msg: string) {
    const text = Logger.stripStyle(Logger.applyData(msg, level, color));
    if (Logger.config.file.enabled) {
      if (!existsSync(Logger.config.file.path)) {
        mkdirSync(Logger.config.file.path);
      }
      const logFilepath = join(Logger.config.file.path, `${Logger.startupTimestamp}.log`);
      if (!existsSync(logFilepath)) {
        writeFileSync(logFilepath, `${text}\n`, Logger.fileEncoding);
        return;
      }
      writeFileSync(logFilepath, `${text}\n`, { flag: 'a', encoding: Logger.fileEncoding });
    }
  }

  private static stripStyle(str: string) {
    return Logger.applyStyle(str).replace(/\x1b\[[0-9;]*m/g, '');
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
    return Logger.config.pattern
      .replace('%time', now())
      .replace('%level', level)
      .replace('%msg', msg)
      .replace('%color', `#${color}`);
  }
}
