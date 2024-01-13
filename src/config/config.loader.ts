import { resolve } from 'path';
import { DefaultConfig } from './config.default';
import { Config } from './config.type';

export class ConfigLoader {
	static config: Config;
	static defaultConfig: Config = DefaultConfig;

	static loadConfig(path?: string): Config {
		const extensions = ['json', 'cjs', 'js', 'mjs'];
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
		return this.mergeConfig(this.defaultConfig, this.config);
	}

	private static mergeConfig(fullConfig: Config, partialConfig: Partial<Config>): Config {
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
