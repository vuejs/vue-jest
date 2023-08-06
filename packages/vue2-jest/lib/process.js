const VueTemplateCompiler = require('vue-template-compiler')
const coffeescriptTransformer = require('./transformers/coffee')
const _processStyle = require('./process-style')
const processCustomBlocks = require('./process-custom-blocks')
const getVueJestConfig = require('./utils').getVueJestConfig
const logResultErrors = require('./utils').logResultErrors
const stripInlineSourceMap = require('./utils').stripInlineSourceMap
const getCustomTransformer = require('./utils').getCustomTransformer
const loadSrc = require('./utils').loadSrc
const babelTransformer = require('babel-jest').default
const generateCode = require('./generate-code')
const mapLines = require('./map-lines')

let isVue27 = false
let compilerUtils

try {
  compilerUtils = require('vue/compiler-sfc')
  isVue27 = true
} catch (e) {
  compilerUtils = require('@vue/component-compiler-utils')
}

function resolveTransformer(lang = 'js', vueJestConfig) {
  const transformer = getCustomTransformer(vueJestConfig['transform'], lang)
  if (/^typescript$|tsx?$/.test(lang)) {
    return transformer || require('./transformers/typescript')(lang)
  } else if (/^coffee$|coffeescript$/.test(lang)) {
    return transformer || coffeescriptTransformer
  } else {
    return transformer || babelTransformer.createTransformer()
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
  result.map = mapLines(scriptPart.map, result.map)
  result.externalSrc = externalSrc
  return result
}

function processScriptSetup(descriptor, filePath, config) {
  if (!descriptor.scriptSetup) {
    return null
  }
  const vueJestConfig = getVueJestConfig(config)
  const content = compilerUtils.compileScript(descriptor, {
    id: filePath,
    reactivityTransform: true,
    ...vueJestConfig.compilerOptions
  })
  const contentMap = mapLines(descriptor.scriptSetup.map, content.map)

  const transformer = resolveTransformer(
    descriptor.scriptSetup.lang,
    vueJestConfig
  )

  const result = transformer.process(content.content, filePath, config)
  result.code = stripInlineSourceMap(result.code)
  result.map = mapLines(contentMap, result.map)

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
  if (isVue27 && scriptSetup) {
    const scriptSetupResult = compilerUtils.compileScript(descriptor, {
      id: filename,
      reactivityTransform: true,
      ...vueJestConfig.compilerOptions
    })
    bindings = scriptSetupResult.bindings
  }

  const userTemplateCompilerOptions = vueJestConfig.templateCompiler || {}
  const result = compilerUtils.compileTemplate({
    source: template.content,
    compiler: VueTemplateCompiler,
    filename: filename,
    isFunctional: template.attrs.functional,
    preprocessLang: template.lang,
    preprocessOptions: vueJestConfig[template.lang],
    ...userTemplateCompilerOptions,
    compilerOptions: {
      ...(!isVue27 ? { optimize: false } : {}),
      ...userTemplateCompilerOptions.compilerOptions
    },
    ...(isVue27 ? { bindings } : {})
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
    compiler: isVue27 ? undefined : VueTemplateCompiler,
    filename
  })

  const templateResult = processTemplate(descriptor, filename, config)
  const stylesResult = processStyle(descriptor.styles, filename, config)
  const customBlocksResult = processCustomBlocks(
    descriptor.customBlocks,
    filename,
    config
  )

  let scriptResult
  const scriptSetupResult = processScriptSetup(descriptor, filename, config)

  if (!scriptSetupResult) {
    scriptResult = processScript(descriptor.script, filename, config)
  }

  const isFunctional =
    (descriptor.template &&
      descriptor.template.attrs &&
      descriptor.template.attrs.functional) ||
    (descriptor.script &&
      descriptor.script.content &&
      /functional:\s*true/.test(descriptor.script.content))

  const output = generateCode(
    scriptResult,
    scriptSetupResult,
    templateResult,
    stylesResult,
    customBlocksResult,
    isFunctional,
    filename
  )

  return {
    code: output.code,
    map: output.map.toString()
  }
}
