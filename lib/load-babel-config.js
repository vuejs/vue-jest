const findBabelConfig = require('find-babel-config')
const logger = require('./logger')
const cache = require('./cache')

var defaultBabelOptions = {
  presets: [require.resolve('babel-preset-vue-app')]
}

module.exports = function getBabelConfig () {
  const cachedConfig = cache.get('babel-config')
  if (cachedConfig) {
    return cachedConfig
  } else {
    const { file, config } = findBabelConfig.sync(process.cwd(), 0)
    if (!file) {
      logger.info('no .babelrc found, defaulting to default babel options')
    }
    const babelConfig = file ? config : defaultBabelOptions
    cache.set('babel-config', babelConfig)
    return babelConfig
  }
}
