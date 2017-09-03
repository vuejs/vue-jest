var ensureRequire = require('../ensure-require.js')

module.exports = function (raw) {
  var html;
  ensureRequire('pug', 'pug')
  var jade = require('pug')
  try {
    var html = jade.compile(raw)()
  } catch (err) {
    throw Error(err)
  }
  return html
}
