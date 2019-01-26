const path = require('path')
const sourceMap = require('source-map')
const splitRE = /\r?\n/g

module.exports = function generateSourceMap(
  scriptResult,
  src,
  filename,
  renderFnStartLine,
  renderFnEndLine,
  templateLine
) {
  const file = path.basename(filename)
  const map = new sourceMap.SourceMapGenerator()

  map.setSourceContent(file, src)
  if (scriptResult) {
    let inputMapConsumer =
      scriptResult.map && new sourceMap.SourceMapConsumer(scriptResult.map)
    scriptResult.code.split(splitRE).forEach(function(line, index) {
      let ln = index + 1
      let originalLine = inputMapConsumer
        ? inputMapConsumer.originalPositionFor({ line: ln, column: 0 }).line
        : ln
      if (originalLine) {
        map.addMapping({
          source: file,
          generated: {
            line: ln,
            column: 0
          },
          original: {
            line: originalLine,
            column: 0
          }
        })
      }
    })
  }

  for (; renderFnStartLine < renderFnEndLine; renderFnStartLine++) {
    map.addMapping({
      source: file,
      generated: {
        line: renderFnStartLine,
        column: 0
      },
      original: {
        line: templateLine,
        column: 0
      }
    })
  }

  return map
}
