var ensureRequire = require('../ensure-require.js')

module.exports = function (raw) {
  var html;
  ensureRequire('jade', 'jade')
  var jade = require('jade')
  try {
    var html = jade.compile(raw)()
  } catch (err) {
    throw Error(err)
  }
  return html
}
