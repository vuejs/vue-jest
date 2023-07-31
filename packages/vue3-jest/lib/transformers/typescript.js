const ensureRequire = require('../ensure-require')
const babelJest = require('babel-jest').default
const {
  stripInlineSourceMap,
  getCustomTransformer,
  getTypeScriptConfig,
  getVueJestConfig
} = require('../utils')

module.exports = scriptLang => ({
  process(scriptContent, filePath, config) {
    ensureRequire('typescript', ['typescript'])
    const typescript = require('typescript')
    const vueJestConfig = getVueJestConfig(config)
    const tsconfig = getTypeScriptConfig(vueJestConfig.tsConfig)

    const res = typescript.transpileModule(scriptContent, {
      ...tsconfig,
      fileName: filePath + (scriptLang === 'tsx' ? '.tsx' : '')
    })

    res.outputText = stripInlineSourceMap(res.outputText)

    const inputSourceMap = res.sourceMapText && JSON.parse(res.sourceMapText)

    const customTransformer =
      getCustomTransformer(vueJestConfig['transform'], 'js') || {}
    const transformer = customTransformer.process
      ? customTransformer
      : babelJest.createTransformer({ inputSourceMap })

    return transformer.process(res.outputText, filePath, config)
  }
})
