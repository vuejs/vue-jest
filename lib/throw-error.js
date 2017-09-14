module.exports = function error (msg) {
  throw new Error('\n[jest-vue] Error: ' + (msg) + '\n')
}
