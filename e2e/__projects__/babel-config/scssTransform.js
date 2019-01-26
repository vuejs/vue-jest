const cssExtract = require('extract-from-css')
module.exports = {
  postProcess: function postProcess(src, filepath, config, attrs) {
    const cssNames = cssExtract.extractClasses(src)
    const obj = {}
    for (let i = 0, l = cssNames.length; i < l; i++) {
      obj[cssNames[i]] = cssNames[i]
    }

    if (attrs.themed) {
      return {
        light: obj,
        dark: obj
      }
    }
    return obj
  },
  preProcess: function postProcess(src, filepath, config, attrs) {
    return `${src}\n .g{width: 10px}`
  }
}
