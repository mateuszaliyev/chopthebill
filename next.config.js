const { i18n } = require("./next-i18next.config");
const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

module.exports = withPWA({
	future: {
		webpack5: true,
	},
	i18n,
	pwa: {
		dest: "public",
		disable: process.env.NODE_ENV === "development",
		runtimeCaching,
	},
});
