const cssExtract = require('extract-from-css')
module.exports = {
  preprocess: function preprocess(src, filepath, config, attrs) {
    return `${src}\n .g{width: 10px}`
  },
  postprocess: function postprocess(src, filepath, config, attrs) {
    const cssNames = cssExtract.extractClasses(src)
    const obj = {}
    for (let i = 0, l = cssNames.length; i < l; i++) {
      obj[cssNames[i]] = cssNames[i]
    }

    if (!attrs.themed) {
      return JSON.stringify(obj)
    }

    return JSON.stringify({
      light: obj,
      dark: obj
    })
  }
}
