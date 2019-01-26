const path = require('path')
const fs = require('fs')
const getVueJestConfig = require('./utils').getVueJestConfig
const transformContent = require('./utils').transformContent
const cssExtract = require('extract-from-css')
const isUnassistedLang = require('./utils').isUnassistedLang
const getCssTransformer = require('./utils').getCustomTransformer

/**
 * Validates and returns custom css transformers.
 *
 * @param {Object} cssTransform - object containing module/path of custom css transformers
 * @param {String} lang - language
 * @returns {Object} transformer - custom css transformer object
 */
function isValidTransformer(transformer = {}, lang) {
  const langSupported = isUnassistedLang(lang)
  const validTransformer = transformer.process || transformer.postProcess || transformer.preProcess
  if ((transformer && (langSupported && transformer.process)) || (!langSupported && validTransformer)) {
    return transformer
  }
  return {}
}

/**
 * Resolves content of css resources from file path
 *
 * @param {Object} resources - global resource files included vue-jest configuration
 * @param {String} lang - language
 * @returns {String} content - content of css resources
 */
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

/**
 * Extract cass names from CSS code.
 *
 * @param {String} cssCode - css code
 * @returns {Object} obj - object with key & value as class names of the input css code
 */
function extractClassMap(cssCode) {
  const cssNames = cssExtract.extractClasses(cssCode)
  const cssMap = {}
  for (let i = 0, l = cssNames.length; i < l; i++) {
    cssMap[cssNames[i]] = cssNames[i]
  }
  return cssMap
}

function processStyleByLang(
  content,
  config,
  filePath,
  lang,
  transformer = {},
  attrs
) {
  const cssContent = getGlobalResources(config.resources, lang) + content
  const preProcessedContent = transformContent(
    cssContent,
    filePath,
    config,
    transformer.preProcess,
    attrs
  )
  const processedContent = require('./compilers/' + lang + '-compiler')(
    preProcessedContent,
    filePath,
    config
  )
  return transformContent(processedContent, filePath, config, transformer.postProcess, attrs)
}

function transformStyles(content, filePath, config, lang, transformer = {}, attrs) {
  if (transformer.process) {
    return transformContent(content, filePath, config, transformer.process, attrs)
  } else if (!isUnassistedLang(lang)) {
    let cssCode = content
    switch (lang) {
      case 'styl':
      case 'stylus':
        cssCode = processStyleByLang(content, config, filePath, 'stylus', transformer, attrs)
        break
      case 'scss':
        cssCode = processStyleByLang(content, config, filePath, lang, transformer, attrs)
        break
      case 'sass':
        cssCode = processStyleByLang(content, config, filePath, lang, transformer, attrs)
        break
    }
    return cssCode
  }
  return {}
}

module.exports = function processStyle(stylePart, filePath, jestConfig = {}) {
  const vueJestConfig = getVueJestConfig(jestConfig)
  const {
    content,
    lang,
    attrs
  } = stylePart
  if (!stylePart || vueJestConfig.experimentalCSSCompile === false) {
    return {}
  }
  
  const cssTransformer = isValidTransformer(getCssTransformer(vueJestConfig['transform'], lang), lang)

  const cssCode = transformStyles(
    content,
    filePath,
    jestConfig,
    lang,
    cssTransformer,
    attrs
  )

  if (typeof cssCode === 'string') {
    return extractClassMap(cssCode)
  }
  return cssCode
}