var ensureRequire = require('../ensure-require.js')

module.exports = function (raw, cb, compiler) {
  ensureRequire('coffee', ['coffee-script'])
  var coffee = require('coffee-script')
  var compiled
  try {
    compiled = coffee.compile(raw, {
      bare: true,
      sourceMap: true
    })
  } catch (err) {
    throw new Error(err)
  }
  return {
      code: compiled.js,
      map: compiled.v3SourceMap
    }
  }
