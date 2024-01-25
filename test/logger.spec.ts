import { expect } from 'chai';
import { test } from 'vitest';
import { DefaultConfig } from '../dist/config/config.default';
import { ConfigLoader } from '../dist/config/config.loader';
import { Logger } from '../dist';
test('Logger - Config loading', () => {
	const config = ConfigLoader.loadConfig();
  Logger.info('Check logs!')
	expect(config).to.be.an('object');
	expect(config.logger).to.not.deep.equal(DefaultConfig.logger);
});
