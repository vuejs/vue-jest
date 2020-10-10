const { parse, compileTemplate, compileScript } = require('@vue/compiler-sfc')
const { transform } = require('@babel/core')
const convertSourceMap = require('convert-source-map')
const babelTransformer = require('babel-jest')

const generateSourceMap = require('./generate-source-map')
const typescriptTransformer = require('./transformers/typescript')
const coffeescriptTransformer = require('./transformers/coffee')
const _processStyle = require('./process-style')
const processCustomBlocks = require('./process-custom-blocks')
const getVueJestConfig = require('./utils').getVueJestConfig
const getTsJestConfig = require('./utils').getTsJestConfig
const logResultErrors = require('./utils').logResultErrors
const stripInlineSourceMap = require('./utils').stripInlineSourceMap
const getCustomTransformer = require('./utils').getCustomTransformer
const loadSrc = require('./utils').loadSrc
const generateCode = require('./generate-code')

const splitRE = /\r?\n/g

function resolveTransformer(lang = 'js', vueJestConfig) {
  const transformer = getCustomTransformer(vueJestConfig['transform'], lang)
  if (/^typescript$|tsx?$/.test(lang)) {
    return transformer || typescriptTransformer
  } else if (/^coffee$|coffeescript$/.test(lang)) {
    return transformer || coffeescriptTransformer
  } else {
    return transformer || babelTransformer
  }
}

function processScript(scriptPart, filePath, config) {
  if (!scriptPart) {
    return null
  }

  let externalSrc = null
  if (scriptPart.src) {
    scriptPart.content = loadSrc(scriptPart.src, filePath)
    externalSrc = scriptPart.content
  }

  const vueJestConfig = getVueJestConfig(config)
  const transformer = resolveTransformer(scriptPart.lang, vueJestConfig)

  const result = transformer.process(scriptPart.content, filePath, config)
  result.code = stripInlineSourceMap(result.code)
  result.externalSrc = externalSrc
  return result
}

function processScriptSetup(descriptor, filePath, config) {
  if (!descriptor.scriptSetup) {
    return null
  }
  const content = compileScript(descriptor)
  const vueJestConfig = getVueJestConfig(config)
  const transformer = resolveTransformer(
    descriptor.scriptSetup.lang,
    vueJestConfig
  )

  const result = transformer.process(content.content, filePath, config)
  result.code = stripInlineSourceMap(result.code)
  return result
}

function processTemplate(descriptor, filename, config) {
  const { template, scriptSetup } = descriptor

  if (!template) {
    return null
  }

  const vueJestConfig = getVueJestConfig(config)

  if (template.src) {
    template.content = loadSrc(template.src, filename)
  }

  let bindings
  if (scriptSetup) {
    const scriptSetupResult = compileScript(descriptor)
    bindings = scriptSetupResult.bindings
  }

  const result = compileTemplate({
    source: template.content,
    filename,
    preprocessLang: template.lang,
    preprocessOptions: vueJestConfig[template.lang],
    compilerOptions: {
      bindingMetadata: bindings,
      mode: 'module'
    }
  })

  logResultErrors(result)

  const tsconfig = getTsJestConfig(config)

  if (tsconfig) {
    // they are using TypeScript.
    const { transpileModule } = require('typescript')
    const { outputText } = transpileModule(result.code, { tsconfig })
    return { code: outputText }
  } else {
    // babel
    const babelify = transform(result.code, { filename: 'file.js' })

    return {
      code: babelify.code
    }
  }
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
  const { descriptor } = parse(src)

  const templateResult = processTemplate(descriptor, filename, config)
  const scriptResult = processScript(descriptor.script, filename, config)
  const scriptSetupResult = processScriptSetup(descriptor, filename, config)
  const stylesResult = processStyle(descriptor.styles, filename, config)
  const customBlocksResult = processCustomBlocks(
    descriptor.customBlocks,
    filename,
    config
  )

  const isFunctional =
    descriptor.template &&
    descriptor.template.attrs &&
    descriptor.template.attrs.functional

  const templateStart = descriptor.template && descriptor.template.start
  const templateLine = src.slice(0, templateStart).split(splitRE).length

  const output = generateCode(
    { scriptResult, scriptSetupResult },
    templateResult,
    stylesResult,
    customBlocksResult,
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
    map: map && map.toJSON()
  }
}
