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

function processScript(scriptPart, filePath, config) {
  if (!scriptPart) {
    return null
  }

  const result = {
    code: null,
    map: null,
    originalCode: scriptPart.content,
    path: filePath
  }

  if (scriptPart.src) {
    const externalScrPath = path.join(filePath, '..', scriptPart.src)
    result.originalCode = fs.readFileSync(externalScrPath, 'utf8')
    result.path = externalScrPath
  }

  const vueJestConfig = getVueJestConfig(config)
  const transformer = resolveTransformer(scriptPart.lang, vueJestConfig)

  const res = transformer.process(result.originalCode, filePath, config)
  result.code = stripInlineSourceMap(res.code)
  result.map = res.map
  return result
}

function processTemplate(template, filename, config) {
  if (!template) {
    return null
  }

  const vueJestConfig = getVueJestConfig(config)

  const result = {
    filename,
    code: null
  }

  if (template.src) {
    template.filename = path.join(filename, '..', template.src)
    template.content = fs.readFileSync(template.filename, 'utf8')
  }

  const compiledTemplate = compilerUtils.compileTemplate({
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

  logResultErrors(compiledTemplate)
  result.code = compiledTemplate.code
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
