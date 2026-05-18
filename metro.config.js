const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

if (!config.resolver.sourceExts.includes('wasm')) {
  config.resolver.sourceExts.push('wasm');
}

module.exports = config;