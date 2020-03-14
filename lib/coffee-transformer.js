const { throwError } = require('./utils')

module.exports.coffeeTransformer = function(src, filename, config) {
  const coffee = require('coffeescript')
  let compiled
  try {
    compiled = coffee.compile(src, {
      filename,
      bare: true,
      sourceMap: true,
      transpile: {
        presets: ['@babel/preset-env']
      }
    })

    return {
      code: compiled.js,
      map: compiled.v3SourceMap
    }
  } catch (err) {
    throwError(err)
  }
}
