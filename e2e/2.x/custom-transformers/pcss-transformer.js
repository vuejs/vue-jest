const postcss = require('postcss')
var colorFunction = require('postcss-color-function')
module.exports = {
  process: function(content, filepath, config, attrs) {
    return postcss([colorFunction()]).process(content).css
  }
}
