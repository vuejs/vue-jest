const splitRE = /\r?\n/g

const VueTemplateCompiler = require('vue-template-compiler')
const generateSourceMap = require('./generate-source-map')
const typescriptTransformer = require('./typescript-transformer')
const coffeescriptTransformer = require('./coffee-transformer')
const _processStyle = require('./process-style')
const fs = require('fs')
const path = require('path')
const getVueJestConfig = require('./utils').getVueJestConfig
const logResultErrors = require('./utils').logResultErrors
const stripInlineSourceMap = require('./utils').stripInlineSourceMap
const throwError = require('./utils').throwError
const babelJestTransformer = require('babel-jest')
const compilerUtils = require('@vue/component-compiler-utils')
const convertSourceMap = require('convert-source-map')
const generateCode = require('./generate-code')

function resolveTransformer(lang, vueJestConfig) {
  if (/^typescript$|tsx?$/.test(lang)) {
    return typescriptTransformer
  } else if (/^coffee$|coffeescript$/.test(lang)) {
    return coffeescriptTransformer
  } else {
    return babelJestTransformer
  }
}

function loadSrc(src, filePath) {
  var dir = path.dirname(filePath)
  var srcPath = path.resolve(dir, src)
  try {
    return fs.readFileSync(srcPath, 'utf-8')
  } catch (e) {
    throwError(
      'Failed to load src: "' + src + '" from file: "' + filePath + '"'
    )
  }
}

function processScript(scriptPart, filePath, config) {
  if (!scriptPart) {
    return null
  }

  if (scriptPart.src) {
    scriptPart.content = loadSrc(scriptPart.src, filePath)
  }

  const vueJestConfig = getVueJestConfig(config)
  const transformer = resolveTransformer(scriptPart.lang, vueJestConfig)

  const result = transformer.process(scriptPart.content, filePath, config)
  result.code = stripInlineSourceMap(result.code)
  return result
}

function processTemplate(template, filename, config) {
  if (!template) {
    return null
  }

  const vueJestConfig = getVueJestConfig(config)

  if (template.src) {
    template.content = loadSrc(template.src, filename)
  }

  const result = compilerUtils.compileTemplate({
    source: template.content,
    compiler: VueTemplateCompiler,
    filename: filename,
    compilerOptions: {
      optimize: false
    },
    isFunctional: template.attrs.functional,
    preprocessLang: template.lang,
    preprocessOptions: vueJestConfig[template.lang]
  })

  logResultErrors(result)

  return result
}

function processStyle(styles, filename, config) {
  if (!styles) {
    return null
  }

  const filteredStyles = styles
    .filter(style => style.module)
    .map(style => ({
      code: _processStyle(style, filename, config),
      moduleName: style.module === true ? '$style' : style.module
    }))

  return filteredStyles.length ? filteredStyles : null
}

module.exports = function(src, filename, config) {
  const descriptor = compilerUtils.parse({
    source: src,
    compiler: VueTemplateCompiler,
    filename
  })

  const templateResult = processTemplate(descriptor.template, filename, config)
  const scriptResult = processScript(descriptor.script, filename, config)
  const stylesResult = processStyle(descriptor.styles, filename, config)

  const isFunctional =
    descriptor.template &&
    descriptor.template.attrs &&
    descriptor.template.attrs.functional

  const templateStart = descriptor.template && descriptor.template.start
  const templateLine = src.slice(0, templateStart).split(splitRE).length

  const output = generateCode(
    scriptResult,
    templateResult,
    stylesResult,
    isFunctional
  )

  const map = generateSourceMap(
    scriptResult,
    src,
    filename,
    output.renderFnStartLine,
    output.renderFnEndLine,
    templateLine
  )

  if (map) {
    output.code += '\n' + convertSourceMap.fromJSON(map.toString()).toComment()
  }

  return {
    code: output.code,
    map
  }
}
