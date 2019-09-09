const postcss = require('postcss')
const postcssrc = require('postcss-load-config')
const ctx = { parser: true, map: 'inline' }
const { plugins } = postcssrc.sync(ctx)
const logger = require('../logger')
const getVueJestConfig = require('../get-vue-jest-config')

module.exports = (content, filePath, jestConfig) => {
  let css = null

  postcss(plugins)
    .process(content, {
      from: undefined
    })
    .then(result => {
      css = result.css || ''
    })
    .catch((e) => {
      css = ''
      if (!getVueJestConfig(jestConfig).hideStyleWarn) {
        logger.warn(`There was an error rendering the POSTCSS in ${filePath}. `)
        logger.warn(`Error while compiling styles: ${e}`)
      }
    })

  while (css === null) { //eslint-disable-line
    require('deasync').sleep(100)
  }

  return css
}
