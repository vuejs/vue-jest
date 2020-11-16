const { SourceNode, SourceMapConsumer } = require('source-map')

function addToSourceMap(node, result) {
  if (result && result.code) {
    if (result.map) {
      node.add(
        SourceNode.fromStringWithSourceMap(
          result.code,
          new SourceMapConsumer(result.map)
        )
      )
    } else {
      node.add(result.code)
    }
  }
}

module.exports = function generateCode(
  scriptResult,
  scriptSetupResult,
  templateResult,
  filename
) {
  var node = new SourceNode(null, null, null)
  addToSourceMap(node, scriptResult)
  addToSourceMap(node, scriptSetupResult)
  addToSourceMap(node, templateResult)

  var tempOutput = node.toString()

  if (
    tempOutput.match(/\}\(.*.?Vue\);/) &&
    tempOutput.includes('vue-class-component')
  ) {
    node.add(`
      ;exports.default = {
      ...exports.default.__vccBase,
      ...exports.default.__vccOpts
    };`)
  }

  if (tempOutput.includes('exports.render = render;')) {
    node.add(';exports.default = {...exports.default, render};')
  } else {
    node.add(';exports.default = {...exports.default};')
  }

  return node.toStringWithSourceMap({ file: filename })
}
