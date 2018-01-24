const vueCompiler = require('vue-template-compiler')
const compileTemplate = require('./template-compiler')
const generateSourceMap = require('./generate-source-map')
const addTemplateMapping = require('./add-template-mapping')
const compileBabel = require('./compilers/babel-compiler')
const compileTypescript = require('./compilers/typescript-compiler')
const compileCoffeeScript = require('./compilers/coffee-compiler')
const extractPropsFromFunctionalTemplate = require('./extract-props')
const fs = require('fs')
const join = require('path').join
const cssExtract = require('extract-from-css')

const splitRE = /\r?\n/g

function processScript (scriptPart) {
  if (!scriptPart) {
    return { code: '' }
  }

  if (/^typescript|tsx?$/.test(scriptPart.lang)) {
    return compileTypescript(scriptPart.content)
  }

  if (scriptPart.lang === 'coffee' || scriptPart.lang === 'coffeescript') {
    return compileCoffeeScript(scriptPart.content)
  }

  return compileBabel(scriptPart.content)
}

function processStyle (stylePart) {
  if (!stylePart) return {}

  let cssCode = stylePart.content
  if (/^styl|stylus$/.test(stylePart.lang)) {
    const stylus = require('stylus')
    cssCode = stylus.render(stylePart.content)
  }

  const cssNames = cssExtract.extractClasses(cssCode)
  const obj = {}

  for (let i = 0, l = cssNames.length; i < l; i++) {
    obj[cssNames[i]] = cssNames[i]
  }

  return obj
}

function changePartsIfFunctional (parts) {
  const isFunctional = parts.template && parts.template.attrs && parts.template.attrs.functional
  if (isFunctional) {
    parts.lang = 'javascript'
    const functionalProps = extractPropsFromFunctionalTemplate(parts.template.content)
    parts.template.content = parts.template.content.replace(/props./g, '')
    parts.script = { type: 'script', content: `export default { props: ${functionalProps} }` }
  }
}

module.exports = function (src, path) {
  var parts = vueCompiler.parseComponent(src, { pad: true })

  changePartsIfFunctional(parts)

  if (parts.script && parts.script.src) {
    parts.script.content = fs.readFileSync(join(path, '..', parts.script.src), 'utf8')
  }

  const result = processScript(parts.script)
  const script = result.code
  const inputMap = result.sourceMap

  let scriptSrc = src
  if (parts.script && parts.script.src) {
    scriptSrc = parts.script.content
  }

  const map = generateSourceMap(script, '', path, scriptSrc, inputMap)
  let output = ';(function(){\n' + script + '\n})()\n' +
    'if (module.exports.__esModule) module.exports = module.exports.default\n' +
    'var __vue__options__ = (typeof module.exports === "function"' +
    '? module.exports.options' +
    ': module.exports)\n'

  if (parts.template) {
    if (parts.template.src) {
      parts.template.content = fs.readFileSync(join(path, '..', parts.template.src), 'utf8')
    }

    const renderFunctions = compileTemplate(parts.template)

    output += '__vue__options__.render = ' + renderFunctions.render + '\n' +
      '__vue__options__.staticRenderFns = ' + renderFunctions.staticRenderFns + '\n'

    if (map) {
      const beforeLines = output.split(splitRE).length
      addTemplateMapping(script, parts, output, map, beforeLines)
    }
  }

  if (Array.isArray(parts.styles) && parts.styles.length > 0) {
    const styleStr = parts.styles.map(ast => {
      const moduleName = ast.module || '$style'
      const styleObj = processStyle(ast)

      return '\n  this[\'' + moduleName + '\'] = ' + JSON.stringify(styleObj)
    })

    output += '\n;(function() {' +
      '\nvar beforeCreate = __vue__options__.beforeCreate' +
      '\nvar styleFn = function () { ' + styleStr + ' }' +
      '\n__vue__options__.beforeCreate = beforeCreate ? [].concat(beforeCreate, styleFn) : [styleFn]' +
      '\n})()'
  }

  return { code: output, map }
}
