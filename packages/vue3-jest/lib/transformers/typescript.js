const ensureRequire = require('../ensure-require')
const babelJest = require('babel-jest').default
const {
  getBabelOptions,
  getTsJestConfig,
  stripInlineSourceMap,
  getCustomTransformer,
  getVueJestConfig
} = require('../utils')

module.exports = {
  process(scriptContent, filePath, config) {
    ensureRequire('typescript', ['typescript'])
    const typescript = require('typescript')
    const vueJestConfig = getVueJestConfig(config)
    const tsconfig = getTsJestConfig(config)
    const babelOptions = getBabelOptions(filePath)

    const res = typescript.transpileModule(scriptContent, {
      ...tsconfig,
      fileName: filePath
    })

    res.outputText = stripInlineSourceMap(res.outputText)

    const inputSourceMap =
      res.sourceMapText !== undefined ? JSON.parse(res.sourceMapText) : ''

    // handle ES modules in TS source code in case user uses non commonjs module
    // output and there is no presets or plugins defined in package.json or babel config file
    let inlineBabelOptions = {}
    if (
      tsconfig.compilerOptions.module !== typescript.ModuleKind.CommonJS &&
      !(babelOptions.presets && babelOptions.presets.length) &&
      !(babelOptions.plugins && babelOptions.plugins.length)
    ) {
      inlineBabelOptions = {
        plugins: [require('@babel/plugin-transform-modules-commonjs')]
      }
    }
    const customTransformer =
      getCustomTransformer(vueJestConfig['transform'], 'js') || {}
    const transformer = customTransformer.process
      ? customTransformer
      : babelJest.createTransformer(
          Object.assign(inlineBabelOptions, {
            inputSourceMap
          })
        )

    return transformer.process(res.outputText, filePath, config)
  }
}
