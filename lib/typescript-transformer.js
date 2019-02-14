const babelJest = require('babel-jest')
const getTSBabelOptions = require('./utils').getTSBabelOptions
const getCustomTransformer = require('./utils').getCustomTransformer
const getVueJestConfig = require('./utils').getVueJestConfig

module.exports = {
  process(scriptContent, filePath, config) {
    const vueJestConfig = getVueJestConfig(config)
    const babelOptions = getTSBabelOptions()
    const customTransformer =
      getCustomTransformer(vueJestConfig['transform'], 'js') || {}
    const transformer = customTransformer.process
      ? customTransformer
      : babelJest.createTransformer(babelOptions)
    return transformer.process(scriptContent, filePath, config)
  }
}
