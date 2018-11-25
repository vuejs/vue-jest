const path = require('path')
const sourceMap = require('source-map')
const splitRE = /\r?\n/g

module.exports = function generateSourceMap(
  script,
  filePath,
  content,
  inputMap
) {
  const filename = path.basename(filePath)

  const map = new sourceMap.SourceMapGenerator()

  map.setSourceContent(filename, content)
  // check input source map from babel/coffee etc

  let inputMapConsumer = inputMap && new sourceMap.SourceMapConsumer(inputMap)
  const generatedOffset = 1
  script.split(splitRE).forEach(function(line, index) {
    let ln = index + 1
    let originalLine = inputMapConsumer
      ? inputMapConsumer.originalPositionFor({ line: ln, column: 0 }).line
      : ln
    if (originalLine) {
      map.addMapping({
        source: filename,
        generated: {
          line: ln + generatedOffset,
          column: 0
        },
        original: {
          line: originalLine,
          column: 0
        }
      })
    }
  })
  map._filename = filename
  return map
}
