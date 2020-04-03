const rule = require('../../../lib/rules/no-undefined-key') // 引入rule
const RuleTester = require('eslint').RuleTester;

const fs = require('fs')
const path = require('path')

const text = fs.readFileSync(path.resolve(__filename, '../../../vue/App.vue')).toString()

const ruleTester = new RuleTester({
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
  settings: {
    i18nPath: '../../data',
  },
});
// 运行测试用例
ruleTester.run('no-undefined-key', rule, {
  // 正确的测试用例
  valid: [
    {
      code: text,
    },
  ],
  // 错误的测试用例
  invalid: [
    {
      code: `export default {
  all: 'All',
  audioInstruction: 'All',
  }`,
      errors: 0,
    },
  ],
});

