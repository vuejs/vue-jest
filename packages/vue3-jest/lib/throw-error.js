module.exports = function throwError(msg) {
  throw new Error('\n[vue-jest] Error: ' + msg + '\n')
}
