const path = require('path')

function generateFullKey(node) {
  const fullKeyList = []
  let currentNode = node
  while (currentNode) {
    if (currentNode.type === 'Property') {
      fullKeyList.push(currentNode.key.name)
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
      description: 'vue-i18n 重复的值',
    },
    fixable: null, // 修复函数
    messages: {
      dupValue: "国际化文件重复value的key是'{{ key }}'",
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
    const valueSet = new Set()

    return {
      'ObjectExpression>Property': (node) => {
        const value = node.value.value
        if (node.value.type === 'Literal') {
          if (valueSet.has(value)) {
            const fullKey = generateFullKey(node)
            context.report({
              node,
              messageId: 'dupValue',
              data: {
                key: fullKey,
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
