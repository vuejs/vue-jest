const path = require('path')
const cssExtract = require('extract-from-css')

module.exports = function processStyle (stylePart, filePath) {
  if (!stylePart) return {}

  const dir = path.dirname(filePath)
  const cwd = process.cwd()
  const processStyleByLang = lang => require('./' + lang)(stylePart.content, dir, cwd)

  let cssCode = ''
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
