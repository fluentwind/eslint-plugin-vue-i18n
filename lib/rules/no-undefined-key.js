const path = require('path')
const shareLangData = require('../utils/shareLangData')
const utils = require('../utils')

const langMap = shareLangData.langMap
let langList = []

function findFinalLeft(node) {
  if (node.type === 'BinaryExpression') {
    return findFinalLeft(node.left)
  } else if (node.type === 'Literal') {
    return node.value
  }
  return ''
}

function processArguments(context, node) {
  const nodeArgs = node.parent.arguments
  let findKey = ''
  if (nodeArgs.length) {
    const firstArg = nodeArgs[0]
    if (firstArg.type === 'Literal') {
      if (firstArg.value) {
        findKey = firstArg.value
      } else {
        context.report({
          node: firstArg,
          messageId: 'invalidKey',
        })
      }
    } else if (firstArg.type === 'TemplateLiteral') {
      if (firstArg.quasis.length && firstArg.quasis[0].value.cooked) {
        // 变量左侧的模板
        findKey = firstArg.quasis[0].value.cooked
      }
    } else if (firstArg.type === 'BinaryExpression') {
      findKey = findFinalLeft(firstArg)
    }

    if (findKey) {
      const undefinedInList = []
      let definedNum = 0
      langList.forEach((language) => {
        const indexInLanguage = Object.keys(langMap[language]).findIndex(fullKey => fullKey.startsWith(findKey))
        if (indexInLanguage > -1) {
          definedNum++
        } else {
          undefinedInList.push(language)
        }
      })

      // 在任何语言中都没定义
      if (definedNum === 0) {
        context.report({
          node: firstArg,
          messageId: 'default',
          data: {
            key: findKey,
          },
        })
        // 有一些国际化中未定义
      } else if (definedNum > 0 && definedNum < langList.length) {
        undefinedInList.forEach((lang) => {
          context.report({
            node: firstArg,
            messageId: 'undefinedInAnotherLang',
            data: {
              key: findKey,
              lang,
            },
          })
        })
      }
    }
  }
}
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: '不允许使用未定义的key',
    },
    fixable: null, // 修复函数
    messages: {
      default: '\'{{key}}\' 在国际化文件中尚未定义',
      undefinedInAnotherLang: '\'{{key}}\' 在语言{{lang}}中未定义',
      invalidKey: '请传入有效的key',
    },
  },
  create(context) {
    const i18nPath = (context.options.length && context.options[0].i18nPath) || context.settings.i18nPath
    if (!i18nPath) {
      return {}
    }
    const fullI18nPath = path.resolve(i18nPath)
    const fileName = context.getFilename()
    const fileDir = path.dirname(fileName)

    if (fileDir === fullI18nPath) {
      return {}
    }
    shareLangData.initData(fullI18nPath)

    langList = Object.keys(langMap)
    // 不存在一种语言
    if (langList.length === 0) {
      return {}
    }

    return utils.defineTemplateBodyVisitor(context, {
      'CallExpression>Identifier': (node) => {
        if (node.name === '$t') {
          processArguments(context, node)
        }
      },
    }, {
      'CallExpression>MemberExpression': (node) => {
        if ((node.object.name === 'i18n' && node.property.name === 't') ||
          (node.object.type === 'ThisExpression' && node.property.name === '$t')) {
          processArguments(context, node)
        }
      },
    });
  },
};
