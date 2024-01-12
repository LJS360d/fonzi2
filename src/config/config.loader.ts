import { resolve } from 'path';
import { Config } from './config.type';

export class ConfigLoader {
	config: Config;

	constructor(private defaultConfig: Config) {}

	loadConfig(path?: string): Config {
		const extensions = ['cjs', 'js', 'mjs'];
		for (const extension of extensions) {
			const modulePath = resolve(path ?? process.cwd(), 'fonzi2.config.' + extension);
			try {
				const { default: config } = require(modulePath);

				this.config = config ?? require(modulePath);
				break;
			} catch (error) {
				continue;
			}
		}
		console.log(this.mergeConfig(this.defaultConfig, this.config));

		return this.mergeConfig(this.defaultConfig, this.config);
	}

	private mergeConfig(fullConfig: Config, partialConfig: Partial<Config>): Config {
    const mergedConfig: Config = { ...fullConfig };

    for (const key in partialConfig) {
      if (partialConfig.hasOwnProperty(key)) {
        const partialValue = partialConfig[key];

        if (typeof partialValue === 'object' && partialValue !== null) {
          // Recursively merge nested objects
          mergedConfig[key] = this.mergeConfig(fullConfig[key], partialValue);
        } else {
          // Override the property if present in partialConfig
          mergedConfig[key] = partialValue;
        }
      }
    }

    return mergedConfig;
  }

}
