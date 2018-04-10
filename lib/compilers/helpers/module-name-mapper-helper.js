const localResolve = require('./local-resolve-helper')

/**
 * Applies the moduleNameMapper substitution from the jest config
 *
 * @param {String} source - the original string
 * @param {String} filePath - the path of the current file (where the source originates)
 * @param {Object} jestConfig - the jestConfig holding the moduleNameMapper settings
 * @returns {String} path - the final path to import (including replacements via moduleNameMapper)
 */
module.exports = function applyModuleNameMapper (source, filePath, jestConfig = {}) {
  // If no moduleNameMapper is present, just return the source
  if (!jestConfig.moduleNameMapper) return source

  // Extract the moduleNameMapper settings from the jest config. TODO: In case of development via babel@7, somehow the jestConfig.moduleNameMapper might end up being an Array. After a proper upgrade to babel@7 we should probably fix this.
  const module = Array.isArray(jestConfig.moduleNameMapper) ? jestConfig.moduleNameMapper : Object.entries(jestConfig.moduleNameMapper)

  // Filter for matching module names
  const matchingModule = module.filter(([regex]) => source.match(regex) !== null)

  const importPath = matchingModule
    .reduce((acc, [regex, replacement]) => replacement.replace(
      /\$([0-9]+)/g,
      (_, index) => source.match(regex)[parseInt(index, 10)]
    ), source)

  // Call localResolve to resolve the file
  return localResolve(
    filePath, // Pass the currently processed file's filepath
    importPath // Pass the processed import path
  )
}

