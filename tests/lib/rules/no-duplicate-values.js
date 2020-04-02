const rule = require('../../../lib/rules/no-duplicated-values') // 引入rule
const RuleTester = require('eslint').RuleTester;

const fs = require('fs')
const path = require('path')

const text = fs.readFileSync(path.resolve(__filename, '../../../data/en.js')).toString()

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2015, // 默认支持语法为es5
    sourceType: 'module',
  },
  settings: {
    i18nPath: '../../data',
  },
});
// 运行测试用例
ruleTester.run('no-duplicated-values', rule, {
  // 正确的测试用例
  valid: [
    {
      code: `export default {
      order: {
    1: '第一次提交',
    2: '第二次提交',
    3: '第三次提交',
    4: '第四次提交',
    5: '第五次提交',
    6: '第六次提交',
  },
      }`,
    },
    {
      code: text,
    },
    {
      code: `export default {
  all: 'All',
  audioInstruction: 'Audio Instruction',
  }`,
    },
    {
      code: '{all}',
    },
    {
      code: `const DateMasks = {
  'zh-CN': {
    default: 'yyyy-MM-dd HH:mm:ss',
    date: 'yyyy-MM-dd',
  },
  en: {
    default: 'MM/dd/yyyy HH:mm:ss',
    date: 'MM/dd/yyyy',
  },
}`,
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

