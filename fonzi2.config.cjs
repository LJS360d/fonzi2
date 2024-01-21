/** @type {import('./src').Config} */
module.exports = {
	logger: {
		remote: {
			enabled: false,
      levels: ['error', 'warn'],
		},
		file: {
			enabled: false,
		},
	},
};
