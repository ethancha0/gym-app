// Babel transforms our source before Metro bundles it.
// `jsxImportSource: 'nativewind'` swaps React's JSX runtime for one that
// understands `className` on React Native components (View, Text, ...).
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    // Drizzle's migrations are .sql files. An app can't read arbitrary files
    // from the project at runtime, so this plugin turns `import sql from
    // './0000_x.sql'` into the file's text, baked into the JS bundle.
    plugins: [['inline-import', { extensions: ['.sql'] }]],
  };
};
