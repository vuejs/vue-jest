var ensureRequire = require('../ensure-require.js')
const throwError = require('../throw-error')

module.exports = function (raw) {
  var html
  ensureRequire('pug', 'pug')
  var jade = require('pug')
  try {
    html = jade.compile(raw)()
  } catch (err) {
    throwError(err)
  }
  return html
}
