const ensureRequire = require('../ensure-require')
const loadBabelConfig = require('../load-babel-config.js')
const { loadTypescriptConfig } = require('../load-typescript-config')
const babelJest = require('babel-jest')
const getVueJestConfig = require('../get-vue-jest-config')

module.exports = function compileTypescript (scriptContent, filePath, config) {
  ensureRequire('typescript', ['typescript'])
  const vueJestConfig = getVueJestConfig(config)
  const typescript = require('typescript')
  const tsConfig = loadTypescriptConfig(vueJestConfig)

  const res = typescript.transpileModule(scriptContent, tsConfig)
  const inputSourceMap = (res.sourceMapText !== undefined)
    ? JSON.parse(res.sourceMapText)
    : ''

  // handle ES modules in TS source code in case user uses non commonjs module
  // output and there is no .babelrc.
  let inlineBabelConfig = {}
  if (tsConfig.compilerOptions.module !== 'commonjs' && !loadBabelConfig(vueJestConfig)) {
    inlineBabelConfig = {
      plugins: [
        require('babel-plugin-transform-es2015-modules-commonjs')
      ]
    }
  }
  const transformer = babelJest.createTransformer(Object.assign(
    inlineBabelConfig,
    {
      inputSourceMap
    }
  ))
  return transformer.process(res.outputText, filePath, config)
}
