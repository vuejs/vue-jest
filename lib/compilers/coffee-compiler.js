var ensureRequire = require('../ensure-require.js')
const throwError = require('../throw-error')
const loadBabelConfig = require('../load-babel-config.js')

module.exports = function (raw, cb, compiler) {
  ensureRequire('coffee', ['coffeescript'])
  var coffee = require('coffeescript')
  var compiled
  try {
    compiled = coffee.compile(raw, {
      bare: true,
      sourceMap: true,
      transpile: loadBabelConfig()
    })
  } catch (err) {
    throwError(err)
  }
  return {
    code: compiled.js,
    map: compiled.v3SourceMap
  }
}
