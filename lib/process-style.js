const path = require('path')
const fs = require('fs')
const getVueJestConfig = require('./utils').getVueJestConfig
const warn = require('./utils').warn
const cssExtract = require('extract-from-css')

module.exports = function processStyle(stylePart, filePath, jestConfig = {}) {
  const vueJestConfig = getVueJestConfig(jestConfig)
  let cssTransform =
    vueJestConfig['cssTransform'] &&
    vueJestConfig['cssTransform'][stylePart.lang]
  const validTransforms = cssTransform && (cssTransform.pre || cssTransform.post)
  cssTransform = cssTransform || {}

  if (!stylePart || vueJestConfig.experimentalCSSCompile === false) {
    return {}
  }

  const globaResources = lang => {
    let globalResources = ''
    if (vueJestConfig.resources && vueJestConfig.resources[lang]) {
      globalResources = vueJestConfig.resources[lang]
        .map(resource => path.resolve(process.cwd(), resource))
        .filter(resourcePath => fs.existsSync(resourcePath))
        .map(resourcePath => fs.readFileSync(resourcePath).toString())
        .join('\n')
    }
    return globalResources
  }

  const cssTransfomer = (transform, content) => {
    if (!validTransforms || !transform || typeof transform !== 'string') {
      return content
    }

    const transformPath = /^(\.\.\/|\.\/|\/)/.test(transform) ? path.resolve(process.cwd(), transform) : transform
    return require(transformPath)(
      content,
      vueJestConfig,
      stylePart.attrs
    )
  }

  const processStyleByLang = lang => {
    const content = globaResources(lang) + stylePart.content
    const preProcessedContent = cssTransfomer(cssTransform.pre, content)
    return require('./compilers/' + lang + '-compiler')(
      preProcessedContent,
      filePath,
      jestConfig
    )
  }

  const extractClassMap = cssCode => {
    const cssNames = cssExtract.extractClasses(cssCode)
    const obj = {}
    for (let i = 0, l = cssNames.length; i < l; i++) {
      obj[cssNames[i]] = cssNames[i]
    }

    return obj
  }

  let cssCode = stylePart.content
  switch (stylePart.lang) {
    case 'styl':
    case 'stylus':
      cssCode = processStyleByLang('stylus')
      break
    case 'scss':
      cssCode = processStyleByLang('scss')
      break
    case 'sass':
      cssCode = processStyleByLang('sass')
      break
  }

  if (validTransforms) {
    let locals = cssTransfomer(cssTransform.post, cssCode)
    if (typeof locals !== 'object') {
      !vueJestConfig.hideStyleWarn &&
        warn(
          'post-transformers are expected to return an object with key value pair as class names of the component'
        )
        locals = extractClassMap(locals)
    }
    return locals
  } else {
    return extractClassMap(cssCode)
  }
}
