const loadOptions = require('@babel/core').loadOptions
const createTransformer = require('ts-jest').createTransformer

/**
 * This module extracts vue-jest relevant parts of a jest config
 *
 * @param {Object} jestConfig - a complete jest config object
 * @returns {Object} vueJestConfig - an object holding vue-jest specific configuration
 */
module.exports.getVueJestConfig = function getVueJestConfig(jestConfig) {
  return (
    (jestConfig && jestConfig.globals && jestConfig.globals['vue-jest']) || {}
  )
}

module.exports.getBabelOptions = function loadBabelOptions(
  filename,
  options = {}
) {
  return {
    ...loadOptions({
      ...options,
      caller: {
        name: 'vue-jest',
        supportsStaticESM: false
      },
      filename,
      sourceMaps: 'both'
    })
  }
}

module.exports.getTsJestConfig = function getTsJestConfig(config) {
  const tr = createTransformer()
  return tr.configsFor(config)
}

module.exports.info = function info(msg) {
  console.info('\n[vue-jest]: ' + msg + '\n')
}

module.exports.warn = function warn(msg) {
  console.warn('\n[vue-jest]: ' + msg + '\n')
}

module.exports.throwError = function error(msg) {
  throw new Error('\n[vue-jest] Error: ' + msg + '\n')
}
