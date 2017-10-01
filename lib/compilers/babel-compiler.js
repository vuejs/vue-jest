const babel = require('babel-core')
const findBabelConfig = require('find-babel-config')
const logger = require('../logger')

var defaultBabelOptions = {
  presets: ['es2015'],
  plugins: ['transform-runtime']
}

module.exports = function compileBabel (scriptContent, inputSourceMap) {
  const { file, config } = findBabelConfig.sync(process.cwd(), 0)

  if (!file) {
    logger.info('no .babelrc found, defaulting to default babel options')
  }

  const sourceMapOptions = {
    sourceMaps: true,
    inputSourceMap: inputSourceMap || null
  }

  const baseBabelOptions = file ? config : defaultBabelOptions
  const babelOptions = Object.assign(sourceMapOptions, baseBabelOptions)

  const res = babel.transform(scriptContent, babelOptions)

  return {
    code: res.code,
    sourceMap: res.map
  }
}
