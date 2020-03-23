function isPlainObject(obj) {
  return toString.call(obj) === '[object Object]'
}
class ObjectParser {
  constructor(object) {
    this.finalObject = {}
    if (!isPlainObject(object)) return this.finalObject
    this.parse(object)
    /* let i = 1
    Object.keys(this.finalObject).forEach((key) => {
      console.log(i++, key, ':', this.finalObject[key])
    }) */
    return this.finalObject
  }

  parse(object, parentKey = '') {
    Object.keys(object).forEach((key) => {
      const value = object[key]
      const finalKey = parentKey !== '' ? `${parentKey}.${key}` : key
      if (isPlainObject(value)) {
        this.parse(value, finalKey)
      } else if (typeof value === 'string') {
        this.finalObject[finalKey] = value
      }
    })
  }
}

module.exports = ObjectParser
