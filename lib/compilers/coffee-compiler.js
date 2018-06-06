var ensureRequire = require('../ensure-require.js')
const throwError = require('../throw-error')
const loadBabelConfig = require('../load-babel-config.js')

module.exports = function (raw, vueJestConfig, filePath) {
  ensureRequire('coffee', ['coffeescript'])
  var coffee = require('coffeescript')
  var compiled
  try {
    compiled = coffee.compile(raw, {
      bare: true,
      sourceMap: true,
      transpile: loadBabelConfig(vueJestConfig, filePath)
    })
  } catch (err) {
    throwError(err)
  }
  return {
    code: compiled.js,
    map: compiled.v3SourceMap
  }
}
