const loadPartialConfig = require('@babel/core').loadPartialConfig
const createTransformer = require('ts-jest').createTransformer
const chalk = require('chalk')

module.exports.getVueJestConfig = function getVueJestConfig(jestConfig) {
  return (
    (jestConfig && jestConfig.globals && jestConfig.globals['vue-jest']) || {}
  )
}

module.exports.getBabelOptions = function loadBabelOptions(
  filename,
  options = {}
) {
  const opts = Object.assign(options, {
    caller: {
      name: 'vue-jest',
      supportsStaticESM: false
    },
    filename,
    sourceMaps: 'both'
  })
  return loadPartialConfig(opts).options
}

module.exports.getTsJestConfig = function getTsJestConfig(config) {
  const tr = createTransformer()
  return tr.configsFor(config)
}

module.exports.success = function success(msg) {
  console.info(chalk.green('\n[vue-jest]: ' + msg + '\n'))
}

module.exports.info = function info(msg) {
  console.info(chalk.blue('\n[vue-jest]: ' + msg + '\n'))
}

module.exports.warn = function warn(msg) {
  console.warn(chalk.red('\n[vue-jest]: ' + msg + '\n'))
}

module.exports.throwError = function error(msg) {
  throw new Error('\n[vue-jest] Error: ' + msg + '\n')
}

module.exports.stripInlineSourceMap = function(str) {
  return str.slice(0, str.indexOf('//# sourceMappingURL'))
}
