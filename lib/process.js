const VueTemplateCompiler = require('vue-template-compiler')
const generateSourceMap = require('./generate-source-map')
const addTemplateMapping = require('./add-template-mapping')
const compileTypescript = require('./compilers/typescript-compiler')
const compileCoffeeScript = require('./compilers/coffee-compiler')
const processStyle = require('./process-style')
const getVueJestConfig = require('./get-vue-jest-config')
const fs = require('fs')
const path = require('path')
const join = path.join
const logger = require('./logger')
const splitRE = /\r?\n/g
const babelJest = require('babel-jest')
const compilerUtils = require('@vue/component-compiler-utils')

function processScript(scriptPart, filePath, config) {
  if (!scriptPart) {
    return { code: '' }
  }

  if (/^typescript|tsx?$/.test(scriptPart.lang)) {
    return compileTypescript(scriptPart.content, filePath, config)
  }

  if (scriptPart.lang === 'coffee' || scriptPart.lang === 'coffeescript') {
    return compileCoffeeScript(scriptPart.content, config, filePath)
  }

  return babelJest.process(scriptPart.content, filePath, config)
}

module.exports = function(src, filePath, config) {
  const vueJestConfig = getVueJestConfig(config)
  const parts = compilerUtils.parse({
    source: src,
    compiler: VueTemplateCompiler,
    filename: path.basename(filePath)
  })

  if (parts.script && parts.script.src) {
    parts.script.content = fs.readFileSync(
      join(filePath, '..', parts.script.src),
      'utf8'
    )
  }

  const result = processScript(parts.script, filePath, config)
  const script = result.code
  const inputMap = result.map

  let scriptSrc = src
  if (parts.script && parts.script.src) {
    scriptSrc = parts.script.content
  }

  const map = generateSourceMap(script, '', filePath, scriptSrc, inputMap)

  let output = `;(function(){
        ${script}
      })()
    var defaultExport = (module.exports.__esModule) 
      ? module.exports.default 
      : module.exports;
    var __vue__options__ = (typeof defaultExport === "function"
      ? defaultExport.options
      : defaultExport)`

  if (parts.template) {
    parts.template.filename = filePath
    if (parts.template.src) {
      parts.template.filename = join(filePath, '..', parts.template.src)
      parts.template.content = fs.readFileSync(parts.template.filename, 'utf8')
    }

    const templateResult = compilerUtils.compileTemplate({
      source: parts.template.content,
      compiler: VueTemplateCompiler,
      filename: path.basename(filePath)
    })
    output += `
    ${templateResult.code}
      __vue__options__.render = render
      __vue__options__.staticRenderFns = staticRenderFns
      `

    if (parts.template.attrs.functional) {
      output += '__vue__options__.functional = true\n'
      output += '__vue__options__._compiled = true\n'
    }

    if (map) {
      const beforeLines = output.split(splitRE).length
      addTemplateMapping(script, parts, output, map, beforeLines)
    }
  }

  if (Array.isArray(parts.styles) && parts.styles.length > 0) {
    if (
      parts.styles.some(ast => /^less|pcss|postcss/.test(ast.lang)) &&
      logger.shouldLogStyleWarn
    ) {
      !vueJestConfig.hideStyleWarn &&
        logger.warn('Less and PostCSS are not currently compiled by vue-jest')
      logger.shouldLogStyleWarn = false
    }

    const styleStr = parts.styles
      .filter(ast => ast.module)
      .map(ast => {
        const styleObj = /^less|pcss|postcss/.test(ast.lang)
          ? {}
          : processStyle(ast, filePath, config)
        console.log(styleObj)
        const moduleName = ast.module === true ? '$style' : ast.module

        return `
        if(!this['${moduleName}']) {
          this['${moduleName}'] = {};
        }
        this['${moduleName}'] = Object.assign(this['${moduleName}'], ${JSON.stringify(
          styleObj
        )});
        `
      })
      .filter(_ => _)
      .join('')

    if (styleStr.length !== 0) {
      if (parts.template.attrs.functional) {
        output += `
        ;(function() {
          var originalRender = __vue__options__.render
          console.log(this._self)
          var styleFn = function () { ${styleStr} }
          __vue__options__.render = function renderWithStyleInjection (h, context) {
            console.log('render', context._self)
            styleFn.call(context)
            return originalRender(h, context)
          }
        })()
        `
      } else {
        output += `
        ;(function() {
          var beforeCreate = __vue__options__.beforeCreate
          var styleFn = function () { ${styleStr} }
          __vue__options__.beforeCreate = beforeCreate ? [].concat(beforeCreate, styleFn) : [styleFn]
        })()
        `
      }
    }
  }

  const base64Map = Buffer.from(JSON.stringify(map)).toString('base64')
  output += `//# sourceMappingURL=data:application/json;charset=utf-8;base64,${base64Map}`

  return { code: output }
}
