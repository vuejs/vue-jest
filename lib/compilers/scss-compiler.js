const path = require('path')
const fs = require('fs')
const ensureRequire = require('../ensure-require')
const logger = require('../logger')

/**
 * Resolves the path to the file locally.
 *
 * @param {String} to - the name of the file to resolve to
 * @param {String} localPath - the local path
 * @returns {String} path - path to the file to import
 */
function localResolve (to, localPath) {
  if (localPath.startsWith('/')) {
    return localPath
  }

  return path.join(path.dirname(to), localPath)
}

/**
 * Applies the moduleNameMapper substitution from the jest config
 *
 * @param {String} source - the original string
 * @param {String} filePath - the path of the current file (where the source originates)
 * @param {Object} jestConfig - the jestConfig holding the moduleNameMapper settings
 * @returns {String} path - the final path to import (including replacements via moduleNameMapper)
 */
function applyModuleNameMapper (source, filePath, jestConfig = {}) {
  if (!jestConfig.moduleNameMapper) return source
  const module = Array.isArray(jestConfig.moduleNameMapper) ? jestConfig.moduleNameMapper : Object.entries(jestConfig.moduleNameMapper)
  return localResolve(
    filePath,
    module
      .filter(([regex, _]) => source.match(regex) !== null)
      .reduce((acc, [regex, replacement]) => replacement.replace(
        /\$([0-9]+)/g,
        (_, index) => source.match(regex)[parseInt(index, 10)]
      ), source)
  )
}

/**
 * This module is meant to compile scss
 *
 * @param {String} content - the content of the scss string that should be compiled
 * @param {String} filePath - the path of the file holding the scss
 * @param {Object} config - the vue-jest config
 * @param {Object} jestConfig - the complete jest config
 * @returns {String} styles - the compiled scss
 */
module.exports = (content, filePath, config, jestConfig) => {
  ensureRequire('scss', ['node-sass'])
  const sass = require('node-sass')

  let scssResources = ''
  if (config && config.resources && config.resources.scss) {
    scssResources = config.resources.scss
      .map(scssResource => path.resolve(process.cwd(), scssResource))
      .filter(scssResourcePath => fs.existsSync(scssResourcePath))
      .map(scssResourcePath => fs.readFileSync(scssResourcePath).toString())
      .join('\n')
  }

  try {
    return sass.renderSync({
      data: scssResources + content,
      outputStyle: 'compressed',
      importer: (url, prev, done) => ({ file: applyModuleNameMapper(url, prev === 'stdin' ? filePath : prev, jestConfig) })
    }).css.toString()
  } catch (err) {
    if (!config.hideStyleWarn) {
      logger.warn(`There was an error rendering the SCSS in ${filePath}. SCSS is not fully supported by vue-jest, so some features will throw errors. Webpack aliases are a common cause of errors. If you use Webpack aliases, please use jest's suggested way via moduleNameMapper which is supported.`)
      logger.warn(`Error while compiling styles: ${err}`)
    }
  }

  return ''
}
