const path = require('path')
const fs = require('fs')
const sass = require('node-sass')

const rewriteImports = (content, filePath) => content.replace(/@import\s+(?:'([^']+)'|"([^"]+)"|([^\s;]+))/g, (entire, single, double, unquoted) => {
  const oldImportPath = single || double || unquoted
  const absoluteImportPath = path.join(path.dirname(filePath), oldImportPath)
  const lastCharacter = entire[entire.length - 1]
  const quote = lastCharacter === "'" || lastCharacter === '"' ? lastCharacter : ''
  const importPath = path.relative(process.cwd(), absoluteImportPath)
  return '@import ' + quote + importPath + quote
})

module.exports = (content, filePath, config) => {
  let scssResources = ''
  if (config.resources && config.resources.scss) {
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
