const { parse, compileTemplate, compileScript } = require('@vue/compiler-sfc')
const { transform } = require('@babel/core')
const babelTransformer = require('babel-jest').default

const typescriptTransformer = require('./transformers/typescript')
const coffeescriptTransformer = require('./transformers/coffee')
const _processStyle = require('./process-style')
const processCustomBlocks = require('./process-custom-blocks')
const getTypeScriptConfig = require('./utils').getTypeScriptConfig
const getVueJestConfig = require('./utils').getVueJestConfig
const logResultErrors = require('./utils').logResultErrors
const stripInlineSourceMap = require('./utils').stripInlineSourceMap
const getCustomTransformer = require('./utils').getCustomTransformer
const loadSrc = require('./utils').loadSrc
const generateCode = require('./generate-code')
const mapLines = require('./map-lines')
const vueComponentNamespace = require('./constants').vueComponentNamespace

function resolveTransformer(lang = 'js', vueJestConfig) {
  const transformer = getCustomTransformer(vueJestConfig['transform'], lang)
  if (/^typescript$|tsx?$/.test(lang)) {
    return transformer || typescriptTransformer(lang)
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

  let content = scriptPart.content
  let filename = filePath
  if (scriptPart.src) {
    content = loadSrc(scriptPart.src, filePath)
    filename = scriptPart.src
  }

  const vueJestConfig = getVueJestConfig(config)
  const transformer = resolveTransformer(scriptPart.lang, vueJestConfig)

  const result = transformer.process(content, filename, config)
  result.code = stripInlineSourceMap(result.code)
  result.map = mapLines(scriptPart.map, result.map)
  return result
}

function processScriptSetup(descriptor, filePath, config) {
  if (!descriptor.scriptSetup) {
    return null
  }
  const vueJestConfig = getVueJestConfig(config)
  const content = compileScript(descriptor, {
    id: filePath,
    refTransform: true,
    ...vueJestConfig.compilerOptions
  })
  const contentMap = mapLines(descriptor.scriptSetup.map, content.map)

  const transformer = resolveTransformer(
    descriptor.scriptSetup.lang,
    vueJestConfig
  )

  const result = transformer.process(content.content, filePath, config)
  result.map = mapLines(contentMap, result.map)

  return result
}

/**
 * Process SFC <template> section.
 * @param {import('@vue/compiler-sfc').SFCDescriptor} descriptor
 * @param {string} filename
 * @param {import('@jest/transform').TransformOptions} config
 */
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
    const scriptSetupResult = compileScript(descriptor, {
      id: filename,
      refTransform: true,
      ...vueJestConfig.compilerOptions
    })
    bindings = scriptSetupResult.bindings
  }

  // Since Vue 3.2.13, it's possible to use TypeScript in templates,
  // but this needs the `isTS` option of the compiler.
  // We could let users set it themselves, but vue-loader and vite automatically add it
  // if the script is in TypeScript, so let's do the same for a seamless experience.
  const lang =
    (descriptor.scriptSetup && descriptor.scriptSetup.lang) ||
    (descriptor.script && descriptor.script.lang)
  const isTS = /^typescript$|tsx?$/.test(lang)

  const result = compileTemplate({
    id: filename,
    source: template.content,
    filename,
    preprocessLang: template.lang,
    preprocessOptions: vueJestConfig[template.lang],
    compilerOptions: {
      bindingMetadata: bindings,
      mode: 'module',
      isTS,
      ...vueJestConfig.compilerOptions
    }
  })

  logResultErrors(result)

  // TypeScript
  if (isTS) {
    const tsconfig = getTypeScriptConfig(vueJestConfig.tsConfig)
    if (tsconfig) {
      const { transpileModule } = require('typescript')
      const { outputText } = transpileModule(result.code, { tsconfig })
      return { code: outputText }
    }
  }

  // babel
  const babelify = transform(result.code, {
    filename: 'file.js',
    presets: ['@babel/preset-env']
  })

  return { code: babelify.code }
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
  const { descriptor } = parse(src, { filename })
  const componentNamespace =
    getVueJestConfig(config)['componentNamespace'] || vueComponentNamespace

  const templateResult = processTemplate(descriptor, filename, config)
  const stylesResult = processStyle(descriptor.styles, filename, config)
  const customBlocksResult = processCustomBlocks(
    descriptor.customBlocks,
    filename,
    componentNamespace,
    config
  )

  let scriptResult
  const scriptSetupResult = processScriptSetup(descriptor, filename, config)

  if (!scriptSetupResult) {
    scriptResult = processScript(descriptor.script, filename, config)
  }

  const output = generateCode({
    scriptResult,
    scriptSetupResult,
    templateResult,
    customBlocksResult,
    componentNamespace,
    filename,
    stylesResult
  })

  return {
    code: output.code,
    map: output.map.toString()
  }
}
