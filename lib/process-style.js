const cssExtract = require('extract-from-css')

module.exports = function processStyle (stylePart, filePath, config) {
  if (!stylePart) return {}

  const processStyleByLang = lang => require('./compilers/' + lang + '-compiler')(stylePart.content, filePath, config)

  let cssCode = stylePart.content
  switch (stylePart.lang) {
    case 'styl':
    case 'stylus':
      cssCode = processStyleByLang('stylus')
      break
    case 'scss':
      cssCode = processStyleByLang('scss')
      break
  }

  const cssNames = cssExtract.extractClasses(cssCode)
  const obj = {}

  for (let i = 0, l = cssNames.length; i < l; i++) {
    obj[cssNames[i]] = cssNames[i]
  }

  return obj
}
