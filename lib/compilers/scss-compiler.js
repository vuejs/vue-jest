const path = require('path')
const fs = require('fs')
const ensureRequire = require('../ensure-require')
const cwd = process.cwd()

const rewriteImports = (content, filePath) => content.replace(/@import\s+(?:'([^']+)'|"([^"]+)"|([^\s;]+))/g, (entire, single, double, unquoted) => {
  const oldImportPath = single || double || unquoted
  const absoluteImportPath = path.join(path.dirname(filePath), oldImportPath)
  const lastCharacter = entire[entire.length - 1]
  const quote = lastCharacter === "'" || lastCharacter === '"' ? lastCharacter : ''
  const importPath = path.relative(cwd, absoluteImportPath)
  return '@import ' + quote + importPath + quote
})

module.exports = (content, filePath, config) => {
  ensureRequire('scss', ['node-sass'])
  const sass = require('node-sass')

  let scssResources = ''
  if (config && config.resources && config.resources.scss) {
    scssResources = config.resources.scss
      .map(scssResource => path.resolve(process.cwd(), scssResource))
      .filter(scssResourcePath => fs.existsSync(scssResourcePath))
      .map(scssResourcePath => rewriteImports(fs.readFileSync(scssResourcePath).toString(), scssResourcePath))
      .join('\n')
  }

  return sass.renderSync({
    data: scssResources + rewriteImports(content, filePath),
    outputStyle: 'compressed'
  }).css.toString()
}
