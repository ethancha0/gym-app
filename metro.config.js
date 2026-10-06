// Metro is React Native's bundler. `withNativeWind` adds a step that compiles
// src/global.css + tailwind.config.js into React Native style objects at build time.
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// inlineRem: 16 makes `1rem` = 16pt, matching web Tailwind's spacing scale
// (NativeWind's default is 14). Reusables' components assume 16.
module.exports = withNativeWind(config, { input: './src/global.css', inlineRem: 16 });
