const path = require('path')

/**
 * Resolves the path to the file locally.
 *
 * @param {String} to - the name of the file to resolve to
 * @param {String} localPath - the local path
 * @returns {String} path - path to the file to import
 */
module.exports = function localResolve (to, localPath) {
  // If localPath already is absolute, don't modify it
  if (localPath.startsWith('/')) {
    return localPath
  }
  // Join together the directory name of the file to be resolved and the local path
  return path.join(path.dirname(to), localPath)
}

