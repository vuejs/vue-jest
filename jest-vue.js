const vueCompiler = require('vue-template-compiler')
const babel = require('babel-core')
const compileTemplate = require('./lib/template-compiler')
const generateSourceMap = require('./lib/generate-source-map')
const addTemplateMapping = require('./lib/add-template-mapping')

const convert = require('convert-source-map')
const splitRE = /\r?\n/g

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
