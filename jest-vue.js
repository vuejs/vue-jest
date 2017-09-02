const vueCompiler = require('vue-template-compiler')
const babel = require('babel-core')
const sourceMap = require('source-map')
const path = require('path')
const compileTemplate = require('./template-compiler')
const convert = require('convert-source-map')
const fs = require('fs')
const splitRE = /\r?\n/g

function generateSourceMap (script, output, filePath, content, inputMap) {
  var hashedFilename = path.basename(filePath)
  var map = new sourceMap.SourceMapGenerator()
  map.setSourceContent(hashedFilename, content)
  // check input source map from babel/coffee etc
  var inputMapConsumer = inputMap && new sourceMap.SourceMapConsumer(inputMap)
  var generatedOffset = (output ? output.split(splitRE).length : 0) + 1
  script.split(splitRE).forEach(function (line, index) {
    var ln = index + 1
    var originalLine = inputMapConsumer
      ? inputMapConsumer.originalPositionFor({ line: ln, column: 0 }).line
      : ln
    if (originalLine) {
      map.addMapping({
        source: hashedFilename,
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
  map._hashedFilename = hashedFilename
  return map
}

function addTemplateMapping (content, parts, output, map, beforeLines) {
  var afterLines = output.split(splitRE).length
  var templateLine = content.slice(0, parts.template.start).split(splitRE).length
  for (; beforeLines < afterLines; beforeLines++) {
    map.addMapping({
      source: map._hashedFilename,
      generated: {
        line: beforeLines,
        column: 0
      },
      original: {
        line: templateLine,
        column: 0
      }
    })
  }
}

module.exports = {
  process (src, path) {
    var parts = vueCompiler.parseComponent(src, { pad: true })
    const renderFunctions = compileTemplate(parts.template.content)

    const result = babel.transform(parts.script.content, {
      sourceMaps: true,
      presets: ['es2015'],
      plugins: ['transform-runtime']
    })

    const script = result.code

    const inputMap = result.map
    const map = generateSourceMap(script, '', path, src, inputMap)
    let output = ';(function(){\n' + script + '\n})()\n' +
      'if (module.exports.__esModule) module.exports = module.exports.default\n' +
      'var __vue__options__ = (typeof module.exports === "function"' +
      '? module.exports.options' +
      ': module.exports)\n'
    var beforeLines
    if (map) {
      beforeLines = output.split(splitRE).length
    }
    output += '__vue__options__.render = ' + renderFunctions.render + '\n' +
      '__vue__options__.staticRenderFns = ' + renderFunctions.staticRenderFns + '\n'
    if (map) {
      addTemplateMapping(script, parts, output, map, beforeLines)
    }

    if (map) {
      output += '\n' + convert.fromJSON(map.toString()).toComment()
    }

    return output
  }
}
