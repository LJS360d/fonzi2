import { expect } from 'chai';
import { test } from 'vitest';
import { DefaultConfig } from '../src/config/config.default';
import { ConfigLoader } from '../src/config/config.loader';
test('Logger - Config loading', () => {
		const config = ConfigLoader.loadConfig();
		expect(config).to.be.an('object');
		expect(config).to.not.deep.equal(DefaultConfig);
});
