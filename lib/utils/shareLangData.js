const path = require('path')
const fs = require('fs')
const ObjectParser = require('../utils/ObjectParser')

const langMap = {}

let initialed = false
function initData(dirPath, currentLang) {
  if (initialed) return
  initialed = true
  const direntList = fs.readdirSync(dirPath, { withFileTypes: true })
  direntList.forEach((dirent) => {
    const fileName = dirent.name
    const ext = path.extname(fileName)
    if (!dirent.isFile() || ext !== '.js') return;
    const lang = path.basename(fileName, '.js')
    if (lang === 'index' || lang === currentLang) return
    const esmRequire = require('esm')(module)
    const object = esmRequire(path.resolve(dirPath, fileName)).default
    langMap[lang] = new ObjectParser(object)
  })
}

function setData(lang, key, value) {
  if (lang && key && value) {
    if (!ObjectParser.isPlainObject(langMap[lang])) {
      langMap[lang] = {}
    }
    langMap[lang][key] = value
  }
}

module.exports = {
  initData,
  setData,
  langMap,
}
