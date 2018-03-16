const stylus = require('stylus')
module.exports = (content, dir, config) => stylus.render(content, { paths: [dir, process.cwd()] })
