/** @type {import('./src').Config} */
module.exports = {
	logger: {
		remote: {
			enabled: false,
      levels: "all",
		},
		file: {
			enabled: true,
      levels: "all",
		},
	},
};
