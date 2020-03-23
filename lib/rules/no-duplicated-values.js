const path = require('path')
const fs = require('fs')
const ObjectParser = require('../utils/ObjectParser')

function generateFullKey(node) {
  const fullKeyList = []
  let currentNode = node
  while (currentNode) {
    if (currentNode.type === 'Property') {
      const key = currentNode.key.name || currentNode.key.value
      fullKeyList.push(key)
    }
    if (currentNode.type === 'ObjectExpression' || currentNode.type === 'Property') {
      currentNode = currentNode.parent
    } else {
      currentNode = null
    }
  }
  return fullKeyList.reverse().join('.')
}
const langMap = {}

function initData(dirPath, currentLang) {
  const fileList = fs.readdirSync(dirPath)
  fileList.forEach((fileName) => {
    const lang = path.basename(fileName, '.js')
    if (lang === 'index' || lang === currentLang) return
    const esmRequire = require('esm')(module)
    const object = esmRequire(path.resolve(dirPath, fileName)).default
    langMap[lang] = new ObjectParser(object)
  })
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'vue-i18n 重复的值，以及多文件相同key-value',
    },
    fixable: null, // 修复函数
    messages: {
      default: '当前语言中重复定义了值 \'{{ key }}\': \'{{value}}\'',
      multiFiles: '\'{{ key }}\': \'{{value}}\' 在所有国际化语言中都相同，建议无需国际化',
      undefinedInAnotherLang: '\'{{key}}\' 在语言{{lang}}中未定义',
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
    if (fileDir !== fullI18nPath) {
      return {}
    }
    const lang = path.basename(fileName, '.js')
    if (lang === 'index') {
      return {}
    }
    initData(fullI18nPath)

    langMap[lang] = {}
    const valueSet = new Set()

    return {
      'ObjectExpression>Property': (node) => {
        const value = node.value.value
        if (node.value.type === 'Literal') {
          const fullKey = generateFullKey(node)
          langMap[lang][fullKey] = value
          const langList = Object.keys(langMap)
          let multiFilesNum = 0
          for (let i = 0; i < langList.length; i++) {
            if (langList[i] !== lang) {
              const currentLang = langList[i]
              const currentMessage = langMap[currentLang]
              if (!currentMessage[fullKey]) {
                context.report({
                  node,
                  messageId: 'undefinedInAnotherLang',
                  data: {
                    key: fullKey,
                    lang: currentLang,
                  },
                })
              }
              if (currentMessage[fullKey] === value) {
                multiFilesNum++
              }
            }
          }
          const inMultipleFiles = multiFilesNum === (langList.length - 1)
          const definedInAnother = multiFilesNum > 0

          // 优先报所有国际化中重复
          if (inMultipleFiles) {
            context.report({
              node,
              messageId: 'multiFiles',
              data: {
                key: fullKey,
                file: fileName,
                value,
              },
            })
          }
          // 所有文件不重复，自己文件中重复
          if (valueSet.has(value) && !inMultipleFiles && !definedInAnother) {
            context.report({
              node,
              messageId: 'default',
              data: {
                key: fullKey,
                value,
              },
            })
          } else {
            valueSet.add(value)
          }
        }
      },
    };
  },
};
