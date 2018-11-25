const crypto = require('crypto')
const babelJest = require('babel-jest')

module.exports = function getCacheKey(
  fileData,
  filename,
  configString,
  { instrument, rootDir }
) {
  return crypto
    .createHash('md5')
    .update(
      babelJest.getCacheKey(fileData, filename, configString, {
        instrument,
        rootDir
      }),
      'hex'
    )
    .digest('hex')
}
