/**
 * @fileoverview lint vue i18n
 * @author fluentwind
 */


//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const requireIndex = require('requireindex');

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


// import all rules in lib/rules
module.exports.rules = requireIndex(`${__dirname}/rules`);
module.exports.configs = {
  base: {
    root: true,
    parser: require.resolve('vue-eslint-parser'),
    parserOptions: {
      ecmaVersion: 2015,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
        experimentalObjectRestSpread: true,
      },
    },
    env: {
      browser: true,
      es6: true,
    },
    plugins: ['@fluentwind/vue-i18n'],
    rules: {
      '@fluentwind/vue-i18n/no-duplicated-values': ['warn'],
      '@fluentwind/vue-i18n/no-undefined-key': ['warn'],
    },
    settings: {
      i18nPath: 'src/lang',
    },
  },
}
