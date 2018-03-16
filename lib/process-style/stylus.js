const stylus = require('stylus')
const path = require('path')

module.exports = (content, filePath, config) => stylus.render(
  content, {
    paths: [path.dirname(filePath), process.cwd()]
  }
)
