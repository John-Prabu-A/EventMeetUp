// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
// eslint-disable-next-line no-undef
const config = getDefaultConfig(__dirname);

config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'native.js');
config.resolver.platforms = ['web', 'ios', 'android'];
config.resolver.assetExts.push('cjs');

module.exports = withNativeWind(config, {
  input: './global.css',
});
