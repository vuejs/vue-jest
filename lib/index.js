const crypto = require('crypto')
const babelJest = require('babel-jest')
const tsJest = require('ts-jest')

module.exports = {
  process: require('./process'),
  getCacheKey: function getCacheKey(
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
      .update(
        tsJest.getCacheKey(fileData, filename, configString, {
          instrument,
          rootDir
        }),
        'hex'
      )
      .digest('hex')
  }
}
