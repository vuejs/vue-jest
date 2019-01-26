const cssExtract = require('extract-from-css')
module.exports = {
  preProcess: function preProcess(src, filepath, config, attrs) {
    return `${src}\n .g{width: 10px}`
  },
  postProcess: function postProcess(src, filepath, config, attrs) {
    const cssNames = cssExtract.extractClasses(src)
    const obj = {}
    for (let i = 0, l = cssNames.length; i < l; i++) {
      obj[cssNames[i]] = cssNames[i]
    }

    if (!attrs.themed) {
      return obj
    }

    return {
      light: obj,
      dark: obj
    }
  }
}
