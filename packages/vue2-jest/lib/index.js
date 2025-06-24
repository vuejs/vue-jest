const crypto = require('crypto')
const babelJest = require('babel-jest').default

// get FIPS status and set hash algorithm accordingly
const isFips = crypto.getFips ? crypto.getFips() : false
const hashAlgorithm = isFips ? 'sha256' : 'md5'

module.exports = {
  process: require('./process'),
  getCacheKey: function getCacheKey(
    fileData,
    filename,
    { config, configString, instrument, rootDir }
  ) {
    return crypto
      .createHash(hashAlgorithm)
      .update(
        babelJest.createTransformer().getCacheKey(fileData, filename, {
          config,
          configString,
          instrument,
          rootDir
        }),
        'hex'
      )
      .digest('hex')
  }
}
