var ensureRequire = require('../ensure-require.js')
const throwError = require('../throw-error')
const loadBabelConfig = require('../load-babel-config.js')

module.exports = function (raw, vueJestConfig, filePath, babelOverWrites) {
  ensureRequire('coffee', ['coffeescript'])
  var coffee = require('coffeescript')
  var compiled
  var babelConfig = loadBabelConfig(vueJestConfig, filePath)

  if (!babelConfig.filename) babelConfig.filename = 'unknown'

  if (babelOverWrites !== undefined) {
    babelConfig = Object.assign(babelConfig, babelOverWrites)
  }
  try {
    compiled = coffee.compile(raw, {
      bare: true,
      sourceMap: true,
      transpile: babelConfig
    })
  } catch (err) {
    throwError(err)
  }
  return {
    code: compiled.js,
    map: compiled.v3SourceMap
  }
}
