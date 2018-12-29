const babel = require('babel-core')
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

  // babelVersion is not a babel option, We are passing it from test to determine if user is using @babel/.... for .babelrc
  const babel7 = babelOptions.babelVersion === 7 ? require('@babel/core') : undefined
  let res
  if (babel7) {
    // delete the version property, as it may/will error-out in transforming
    delete babelOptions.babelVersion
    res = babel7.transformSync(scriptContent, babelOptions)
  } else {
    res = babel.transform(scriptContent, babelOptions)
  }

  return {
    code: res.code,
    sourceMap: res.map
  }
}
