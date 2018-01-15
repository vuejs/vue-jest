const findBabelConfig = require('find-babel-config')
const logger = require('./logger')
const cache = require('./cache')

module.exports = function getBabelConfig () {
  const cachedConfig = cache.get('babel-config')
  if (cachedConfig) {
    return cachedConfig
  } else if (cachedConfig === false) {
    return
  } else {
    const { file, config } = findBabelConfig.sync(process.cwd(), 0)
    if (!file) {
      logger.info('no .babelrc found, skipping babel compilation')
      cache.set('babel-config', false)
      return
    }
    cache.set('babel-config', config)
    return config
  }
}
