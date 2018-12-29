const ensureRequire = require('../ensure-require')
const babelJest = require('babel-jest')
const getVueJestConfig = require('../utils').getVueJestConfig
const getBabelOptions = require('../utils').getBabelOptions
const createTransformer = require('ts-jest').createTransformer
const getTsJestConfig = require('../utils').getTsJestConfig

module.exports = function compileTypescript(scriptContent, filePath, config) {
  ensureRequire('typescript', ['typescript'])
  const typescript = require('typescript')
  const vueJestConfig = getVueJestConfig(config)

  const { tsconfig } = getTsJestConfig(config)
  const babelConfig = getBabelOptions(filePath)

  const res = typescript.transpileModule(scriptContent, tsconfig)

  const inputSourceMap =
    res.sourceMapText !== undefined ? JSON.parse(res.sourceMapText) : ''

  // handle ES modules in TS source code in case user uses non commonjs module
  // output and there is no .babelrc.
  let inlineBabelConfig = {}
  if (tsconfig.compilerOptions.module !== 'commonjs' && !babelConfig) {
    inlineBabelConfig = {
      plugins: [require('@babel/plugin-transform-modules-commonjs')]
    }
  }

  const transformer = babelJest.createTransformer({
    ...inlineBabelConfig,
    inputSourceMap
  })

  return transformer.process(res.outputText, filePath, config)
}
