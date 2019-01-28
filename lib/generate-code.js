const splitRE = /\r?\n/g

module.exports = function generateCode(
  scriptResult,
  templateResult,
  stylesResult,
  isFunctional
) {
  let output = ''
  let renderFnStartLine
  let renderFnEndLine

  if (scriptResult) {
    output += `${scriptResult.code};\n`
  } else {
    output +=
      `Object.defineProperty(exports, "__esModule", {\n` +
      `  value: true\n` +
      `});\n` +
      'module.exports.default = {};\n'
  }

  output +=
    `var __options__ = typeof exports.default === 'function' ` +
    `? exports.default.options ` +
    `: exports.default\n`

  if (templateResult) {
    renderFnStartLine = output.split(splitRE).length
    templateResult.code = templateResult.code.replace(
      'var _c = _vm._self._c || _h',
      '/* istanbul ignore next */\nvar _c = _vm._self._c || _h'
    )
    output += `${templateResult.code}\n`

    renderFnEndLine = output.split(splitRE).length

    output +=
      `__options__.render = render\n` +
      `__options__.staticRenderFns = staticRenderFns\n`

    if (isFunctional) {
      output += '__options__.functional = true\n'
      output += '__options__._compiled = true\n'
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
      output +=
        `;(function() {\n` +
        `  var originalRender = __options__.render\n` +
        `  var styleFn = function () { ${styleStr} }\n` +
        `  __options__.render = function renderWithStyleInjection (h, context) {\n` +
        `    styleFn.call(context)\n` +
        `    return originalRender(h, context)\n` +
        `  }\n` +
        `})()\n`
    } else {
      output +=
        `;(function() {\n` +
        `  var beforeCreate = __options__.beforeCreate\n` +
        `  var styleFn = function () { ${styleStr} }\n` +
        `  __options__.beforeCreate = beforeCreate ? [].concat(beforeCreate, styleFn) : [styleFn]\n` +
        `})()\n`
    }
  }
  return {
    code: output,
    renderFnStartLine,
    renderFnEndLine
  }
}
