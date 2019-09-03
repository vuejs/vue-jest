const postcss = require('postcss');
const postcssrc = require('postcss-load-config')
const throwError = require('../throw-error')

const ctx = { parser: true, map: 'inline' }

const { plugins, options } = postcssrc.sync(ctx)

console.log(options, 7777);

module.exports = (content) => {
  let css = null

  postcss(plugins)
    .process(content, options || {})
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
