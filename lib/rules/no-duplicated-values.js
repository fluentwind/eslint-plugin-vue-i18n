const path = require('path')
const shareLangData = require('../utils/shareLangData')

const langMap = shareLangData.langMap

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
    shareLangData.initData(fullI18nPath)
    // {'value':['key1','key2']}
    const valueMap = {}

    return {
      'ObjectExpression>Property': (node) => {
        const value = node.value.value
        if (node.value.type === 'Literal') {
          const fullKey = generateFullKey(node)
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
          } else if (valueMap[value]) {
            if (langList.length === 1) {
              context.report({
                node,
                messageId: 'default',
                data: {
                  key: fullKey,
                  value,
                },
              })
            } else {
            // 当前文件有重复且在另一个文件里的这两个key也存在重复value

              const dupKeyList = valueMap[value]
              let isDuped = false
              dupKeyList.forEach((key) => {
                if (isDuped) return
                // 和其他重复的key在其他语言中进行比较，必须在任何其他语言中都相同才认定为重复
                let dupInLang = 0

                for (let i = 0; i < langList.length; i++) {
                  if (langList[i] !== lang) {
                    const currentLang = langList[i]
                    const currentMessage = langMap[currentLang]
                    if (currentMessage[key] === currentMessage[fullKey]) {
                      dupInLang++
                      if (dupInLang >= langList.length - 1) {
                        isDuped = true
                        break
                      }
                    }
                  }
                }
              })
              if (isDuped) {
                context.report({
                  node,
                  messageId: 'default',
                  data: {
                    key: fullKey,
                    value,
                  },
                })
              }
            }
          }

          // 加入本地scope的重复列表
          if (Array.isArray(valueMap[value])) {
            valueMap[value].push(fullKey)
          } else {
            valueMap[value] = [fullKey]
          }
        }
      },
    };
  },
};
