// Babel transforms our source before Metro bundles it.
// `jsxImportSource: 'nativewind'` swaps React's JSX runtime for one that
// understands `className` on React Native components (View, Text, ...).
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
  };
};
