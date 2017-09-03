const vueCompiler = require('vue-template-compiler')
const compileTemplate = require('./lib/template-compiler')
const generateSourceMap = require('./lib/generate-source-map')
const addTemplateMapping = require('./lib/add-template-mapping')
const convertSourceMap = require('convert-source-map')
const compileBabel = require('./lib/compilers/babel-compiler')
const compileTypescript = require('./lib/compilers/typescript-compiler')
const compileCoffeeScript = require('./lib/compilers/coffee-compiler')

const splitRE = /\r?\n/g

function processScript (scriptPart) {
  if (scriptPart.lang === 'typescript' || scriptPart.lang === 'ts') {
    return compileTypescript(scriptPart.content)
  }

  if (scriptPart.lang === 'coffee') {
    return compileCoffeeScript(scriptPart.content)
  }

  return compileBabel(scriptPart.content)
}

module.exports = {
  process (src, path) {
    var parts = vueCompiler.parseComponent(src, { pad: true })
    const renderFunctions = compileTemplate(parts.template)

    const result = processScript(parts.script)

    const script = result.code
    const inputMap = result.sourceMap

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
      output += '\n' + convertSourceMap.fromJSON(map.toString()).toComment()
    }

    return output
  }
}
