const path = require('path')
const fs = require('fs')
const cssExtract = require('extract-from-css')
const getVueJestConfig = require('./utils').getVueJestConfig
const compileStyle = require('@vue/component-compiler-utils').compileStyle
const applyModuleNameMapper = require('./module-name-mapper-helper')
const getCustomTransformer = require('./utils').getCustomTransformer
const logResultErrors = require('./utils').logResultErrors

function getGlobalResources(resources, lang) {
  let globalResources = ''
  if (resources && resources[lang]) {
    globalResources = resources[lang]
      .map(resource => path.resolve(process.cwd(), resource))
      .filter(resourcePath => fs.existsSync(resourcePath))
      .map(resourcePath => fs.readFileSync(resourcePath).toString())
      .join('\n')
  }
  return globalResources
}

function extractClassMap(cssCode) {
  const cssNames = cssExtract.extractClasses(cssCode)
  const cssMap = {}
  for (let i = 0, l = cssNames.length; i < l; i++) {
    cssMap[cssNames[i]] = cssNames[i]
  }
  return cssMap
}

function getPreprocessOptions(lang, filePath, jestConfig) {
  if (lang === 'scss' || lang === 'sass') {
    return {
      importer: (url, prev, done) => ({
        file: applyModuleNameMapper(
          url,
          prev === 'stdin' ? filePath : prev,
          jestConfig,
          lang
        )
      })
    }
  }
  if (lang === 'styl' || lang === 'stylus') {
    return {
      paths: [path.dirname(filePath), process.cwd()]
    }
  }
}

module.exports = function processStyle(stylePart, filename, config = {}) {
  const vueJestConfig = getVueJestConfig(config)

  let content = stylePart.content || ''

  if (!stylePart || vueJestConfig.experimentalCSSCompile === false) {
    return {}
  }

  content =
    getGlobalResources(vueJestConfig.resources, stylePart.lang) + content

  const transformer = getCustomTransformer(
    vueJestConfig['transform'],
    stylePart.lang
  )

  // TODO: validate transformer

  // pre process
  if (transformer.preProcess) {
    content = transformer.preProcess(content, filename, config, stylePart.attrs)
  }

  // transform
  if (transformer.process) {
    content = transformer.process(content, filename, config, stylePart.attrs)
  } else {
    const preprocessOptions = getPreprocessOptions(
      stylePart.lang,
      filename,
      config
    )
    const result = compileStyle({
      source: content,
      filename,
      preprocessLang: stylePart.lang,
      preprocessOptions,
      scoped: false
    })
    logResultErrors(result)
    content = result.code
  }

  // post process
  if (transformer.postProcess) {
    return transformer.postProcess(content, filename, config, stylePart.attrs)
  }

  return extractClassMap(content)
}
