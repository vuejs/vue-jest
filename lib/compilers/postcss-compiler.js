const postcss = require('postcss')
const postcssrc = require('postcss-load-config')
const ctx = { parser: true, map: 'inline' }
const { plugins } = postcssrc.sync(ctx)

const throwError = require('../throw-error')

module.exports = (content) => {
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
      throwError(e)
    })

  while (css === null) { //eslint-disable-line
    require('deasync').sleep(100)
  }

  return css
}
