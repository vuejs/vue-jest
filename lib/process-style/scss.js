const path = require('path')
const fs = require('fs')
const sass = require('node-sass')

module.exports = (content, dir, cwd) => {

  const getRelativeImportPath = (oldImportPath, absoluteImportPath) => (/^\~/.test(oldImportPath))
    ? oldImportPath
    : path.relative(cwd, absoluteImportPath);

  const scssResources = require(cwd + '/package.json').vueJest.resources.scss
    .map(scssResource => path.resolve(cwd, scssResource))
    .filter(scssResourcePath => fs.existsSync(scssResourcePath))
    .map(scssResourcePath => fs.readFileSync(scssResourcePath).toString()
      .replace(/@import\s+(?:'([^']+)'|"([^"]+)"|([^\s;]+))/g, (entire, single, double, unquoted) => {
        var oldImportPath = single || double || unquoted;
        var absoluteImportPath = path.join(path.dirname(scssResourcePath), oldImportPath);
        var relImportPath = getRelativeImportPath(oldImportPath, absoluteImportPath);
        var newImportPath = relImportPath.split(path.sep).join('/');
        var lastCharacter = entire[entire.length - 1];
        var quote = lastCharacter === "'" || lastCharacter === '"' ? lastCharacter : '';
        return '@import ' + quote + newImportPath + quote;
      })
    )
    .join('\n')

  return sass.renderSync({
    data: scssResources + content,
    outputStyle: 'compressed'
  }).css.toString()
  
}