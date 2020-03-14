const path = require('path')
const fs = require('fs')

const throwError = function error(msg) {
  throw new Error('\n[vue-jest] Error: ' + msg + '\n')
}

const loadSrc = (src, filePath) => {
  var dir = path.dirname(filePath)
  var srcPath = path.resolve(dir, src)
  try {
    return fs.readFileSync(srcPath, 'utf-8')
  } catch (e) {
    throwError(
      'Failed to load src: "' + src + '" from file: "' + filePath + '"'
    )
  }
}

module.exports = {
  throwError,
  loadSrc
}

