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
    plugins: ['vue-i18n'],
    rules: {
      'vue-i18n/no-duplicated-values': ['warn'],
    },
    settings: {
      i18nPath: 'src/lang',
    },
  },
}
