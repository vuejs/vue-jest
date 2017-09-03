const babel = require('babel-core')
const path = require('path')
const fs = require('fs')

var defaultBabelOptions = {
  presets: ['es2015'],
  plugins: ['transform-runtime']
}

function getBabelRc (path) {
  var rc
  try {
    rc = JSON.parse(fs.readFileSync(path, 'utf-8'))
  } catch (e) {
    throw new Error('[vue-jest] Your .babelrc seems to be incorrectly formatted.')
  }
  return rc
}

module.exports = function compileBabel (scriptContent) {
  const babelRcPath = path.resolve(process.cwd(), '.babelrc')
  const babelRcExists = fs.existsSync(babelRcPath);
  const baseBabelOptions = babelRcExists ? getBabelRc(babelRcPath) : defaultBabelOptions
  const babelOptions = Object.assign({sourceMaps: true}, baseBabelOptions)

  const res =  babel.transform(scriptContent, babelOptions)

  return {
    code: res.code,
    sourceMap: res.map
  }
}
