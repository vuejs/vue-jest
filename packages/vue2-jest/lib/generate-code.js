const namespace = require('./constants').vueOptionsNamespace
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
  stylesResult,
  customBlocksResult,
  isFunctional,
  filename
) {
  var node = new SourceNode(null, null)

  if (scriptResult || scriptSetupResult) {
    scriptResult && addToSourceMap(node, scriptResult)
    scriptSetupResult && addToSourceMap(node, scriptSetupResult)
  } else {
    node.add(
      `Object.defineProperty(exports, "__esModule", {\n` +
        `  value: true\n` +
        `});\n` +
        'module.exports.default = {};\n'
    )
  }

  node.add(
    `var ${namespace} = typeof exports.default === 'function' ` +
      `? exports.default.options ` +
      `: exports.default\n`
  )

  if (templateResult) {
    addToSourceMap(node, templateResult)

    node.replaceRight(
      'var _c = _vm._self._c || _h',
      '/* istanbul ignore next */\nvar _c = _vm._self._c || _h'
    )

    node.add(
      `\n__options__.render = render\n` +
        `${namespace}.staticRenderFns = staticRenderFns\n`
    )

    if (isFunctional) {
      node.add(`${namespace}.functional = true\n`)
      node.add(`${namespace}._compiled = true\n`)
    }
  }

  if (stylesResult) {
    const styleStr = stylesResult
      .map(
        ({ code, moduleName }) =>
          `if(!this['${moduleName}']) {\n` +
          `  this['${moduleName}'] = {};\n` +
          `}\n` +
          `this['${moduleName}'] = Object.assign(\n` +
          `this['${moduleName}'], ${code});\n`
      )
      .join('')

    if (isFunctional) {
      node.add(
        `;(function() {\n` +
          `  var originalRender = ${namespace}.render\n` +
          `  var styleFn = function () { ${styleStr} }\n` +
          `  ${namespace}.render = function renderWithStyleInjection (h, context) {\n` +
          `    styleFn.call(context)\n` +
          `    return originalRender(h, context)\n` +
          `  }\n` +
          `})()\n`
      )
    } else {
      node.add(
        `;(function() {\n` +
          `  var beforeCreate = ${namespace}.beforeCreate\n` +
          `  var styleFn = function () { ${styleStr} }\n` +
          `  ${namespace}.beforeCreate = beforeCreate ? [].concat(beforeCreate, styleFn) : [styleFn]\n` +
          `})()\n`
      )
    }
  }

  if (customBlocksResult) {
    node.add(`;\n ${customBlocksResult}`)
  }

  return node.toStringWithSourceMap({ file: filename })
}
