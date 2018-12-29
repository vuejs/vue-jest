const babel = require('@babel/core')
const loadBabelConfig = require('../load-babel-config.js')

module.exports = function compileBabel (scriptContent, inputSourceMap, inlineConfig, vueJestConfig, filePath, babelOverWrites) {
  const babelConfig = inlineConfig || loadBabelConfig(vueJestConfig, filePath)

  if (!babelConfig) {
    return {
      code: scriptContent,
      sourceMap: inputSourceMap
    }
  }

  const sourceMapOptions = {
    sourceMaps: true,
    inputSourceMap: inputSourceMap
  }

  let babelOptions = Object.assign(sourceMapOptions, babelConfig)
  if (!babelOptions.filename) babelOptions.filename = 'unknown'

  if (babelOverWrites !== undefined) {
    babelOptions = Object.assign(babelOptions, babelOverWrites)
  }

  const res = babel.transformSync(scriptContent, babelOptions)

  return {
    code: res.code,
    sourceMap: res.map
  }
}
