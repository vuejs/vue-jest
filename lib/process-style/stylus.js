const stylus = require('stylus')
module.exports = (content, dir, cwd) => stylus.render(content, { paths: [dir, cwd] })