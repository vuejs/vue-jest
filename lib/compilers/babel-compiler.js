const babel = require('babel-core')
const loadBabelConfig = require('../load-babel-config.js')

module.exports = function compileBabel (scriptContent, inputSourceMap, inlineConfig, vueJestConfig) {
  const babelConfig = inlineConfig || loadBabelConfig(vueJestConfig)

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

  const babelOptions = Object.assign(sourceMapOptions, babelConfig)

  const res = babel.transform(scriptContent, babelOptions)

  return {
    code: res.code,
    sourceMap: res.map
  }
}
