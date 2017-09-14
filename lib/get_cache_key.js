var crypto = require('crypto')

function getCacheKey (fileData, filename, configString) {
  return crypto.createHash('md5')
    .update(fileData + filePath + configString, 'utf8')
    .digest('hex')
}
