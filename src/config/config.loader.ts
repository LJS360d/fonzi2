import { resolve } from 'node:path';
import { DefaultConfig } from './config.default';
import type { Config } from './config.type';

export class ConfigLoader {
  static config: Config;
  static defaultConfig: Config = DefaultConfig;

  static loadConfig(path?: string): Config {
    if (ConfigLoader.config) {
      return ConfigLoader.mergeConfig(ConfigLoader.defaultConfig, ConfigLoader.config);
    }
    const extensions = ['cjs', 'js', 'mjs'];
    for (const extension of extensions) {
      const modulePath = resolve(path ?? process.cwd(), `fonzi2.config.${extension}`);
      try {
        const { default: config } = require(modulePath);
        ConfigLoader.config = config ?? require(modulePath);
        break;
      } catch (error) {
        // ignore and try next
      }
    }
    return ConfigLoader.mergeConfig(ConfigLoader.defaultConfig, ConfigLoader.config);
  }

  private static mergeConfig(fullConfig: Config, partialConfig: Partial<Config>): Config {
    const mergedConfig: Config = { ...fullConfig };

    for (const key in partialConfig) {
      if (key in partialConfig) {
        const partialValue = partialConfig[key];

        if (typeof partialValue === 'object' && partialValue !== null) {
          // Recursively merge nested objects
          mergedConfig[key] = ConfigLoader.mergeConfig(fullConfig[key], partialValue);
        } else {
          // Override the property if present in partialConfig
          mergedConfig[key] = partialValue;
        }
      }
    }

    return mergedConfig;
  }
}
