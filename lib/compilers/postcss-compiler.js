const postcss = require('postcss');
const postcssrc = require('postcss-load-config')

const ctx = { parser: true, map: 'inline' }

const { plugins, options } = postcssrc.sync(ctx)

module.exports = (content) => {
  console.log(888, plugins)
  let css = null

  postcss(plugins)
    .process(content, options)
    .then(result => {
      css = result.css || ''
    })

  while (css === null) { //eslint-disable-line
    require('deasync').sleep(100)
  }

  return css
}
