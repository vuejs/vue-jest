const ensureRequire = require('../ensure-require')
const babelJest = require('babel-jest')
const getBabelOptions = require('../utils').getBabelOptions
const getTsJestConfig = require('../utils').getTsJestConfig
const stripInlineSourceMapComment = require('../utils')
  .stripInlineSourceMapComment

module.exports = function compileTypescript(scriptContent, filePath, config) {
  ensureRequire('typescript', ['typescript'])
  const typescript = require('typescript')

  const { tsconfig } = getTsJestConfig(config)
  const babelOptions = getBabelOptions(filePath)

  const res = typescript.transpileModule(scriptContent, tsconfig)

  res.outputText = stripInlineSourceMapComment(res.outputText)

  const inputSourceMap =
    res.sourceMapText !== undefined ? JSON.parse(res.sourceMapText) : ''

  // handle ES modules in TS source code in case user uses non commonjs module
  // output and there is no .babelrc.
  let inlineBabelOptions = {}
  if (tsconfig.compilerOptions.module !== 'commonjs' && !babelOptions) {
    inlineBabelOptions = {
      plugins: [require('@babel/plugin-transform-modules-commonjs')]
    }
  }

  const transformer = babelJest.createTransformer(
    Object.assign(inlineBabelOptions, { inputSourceMap })
  )

  return transformer.process(res.outputText, filePath, config)
}
