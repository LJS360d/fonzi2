import { resolve } from 'node:path';
import { DefaultConfig } from './config.default';
import type { Config } from './config.type';

export namespace ConfigLoader {
  let config: Config;
  const defaultConfig: Config = DefaultConfig;

  export function loadConfig(path?: string): Config {
    if (config) {
      return mergeConfig(defaultConfig, config);
    }
    const extensions = ['cjs', 'js', 'mjs'];
    for (const extension of extensions) {
      const modulePath = resolve(
        path ?? process.cwd(),
        `fonzi2.config.${extension}`
      );
      try {
        const { default: conf } = require(modulePath);
        config = conf ?? require(modulePath);
        break;
      } catch (error) {
        // ignore and try next
      }
    }
    return mergeConfig(defaultConfig, config);
  }

  export function mergeConfig(
    fullConfig: Config,
    partialConfig: Partial<Config>
  ): Config {
    const mergedConfig: Config = { ...fullConfig };

    for (const key in partialConfig) {
      if (key in partialConfig) {
        const partialValue = partialConfig[key];

        if (typeof partialValue === 'object' && partialValue !== null) {
          // Recursively merge nested objects
          mergedConfig[key] = mergeConfig(fullConfig[key], partialValue);
        } else {
          // Override the property if present in partialConfig
          mergedConfig[key] = partialValue;
        }
      }
    }

    return mergedConfig;
  }
}
