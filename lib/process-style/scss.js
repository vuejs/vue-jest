const path = require('path')
const fs = require('fs')
const sass = require('node-sass')
const cwd = process.cwd()

module.exports = (content, dir, config) => {
  const getRelativeImportPath = (oldImportPath, absoluteImportPath) => (/^\~/.test(oldImportPath))
    ? oldImportPath
    : path.relative(cwd, absoluteImportPath)

  let scssResources = ''
  if (config.resources && config.resources.scss) {
    scssResources = config.resources.scss
      .map(scssResource => path.resolve(cwd, scssResource))
      .filter(scssResourcePath => fs.existsSync(scssResourcePath))
      .map(scssResourcePath => fs.readFileSync(scssResourcePath).toString()
        .replace(/@import\s+(?:'([^']+)'|"([^"]+)"|([^\s;]+))/g, (entire, single, double, unquoted) => {
          const oldImportPath = single || double || unquoted
          const absoluteImportPath = path.join(path.dirname(scssResourcePath), oldImportPath)
          const relImportPath = getRelativeImportPath(oldImportPath, absoluteImportPath)
          const newImportPath = relImportPath.split(path.sep).join('/')
          const lastCharacter = entire[entire.length - 1]
          const quote = lastCharacter === "'" || lastCharacter === '"' ? lastCharacter : ''
          return '@import ' + quote + newImportPath + quote
        })
      )
      .join('\n')
  }

  return sass.renderSync({
    data: scssResources + content,
    outputStyle: 'compressed'
  }).css.toString()
}
