const VueTemplateCompiler = require('vue-template-compiler')
const generateSourceMap = require('./generate-source-map')
const addTemplateMapping = require('./add-template-mapping')
const compileTypescript = require('./compilers/typescript-compiler')
const compileCoffeeScript = require('./compilers/coffee-compiler')
const processStyle = require('./process-style')
const fs = require('fs')
const path = require('path')
const join = path.join
const getVueJestConfig = require('./utils').getVueJestConfig
const throwError = require('./utils').throwError
const warn = require('./utils').warn
const splitRE = /\r?\n/g
const babelJest = require('babel-jest')
const compilerUtils = require('@vue/component-compiler-utils')
const chalk = require('chalk')
const convertSourceMap = require('convert-source-map')

function processScript(scriptPart, filePath, config) {
  if (!scriptPart) {
    return { code: '' }
  }

  if (/^typescript|tsx?$/.test(scriptPart.lang)) {
    return compileTypescript(scriptPart.content, filePath, config)
  }

  if (scriptPart.lang === 'coffee' || scriptPart.lang === 'coffeescript') {
    return compileCoffeeScript(scriptPart.content, filePath, config)
  }

  return babelJest.process(scriptPart.content, filePath, config)
}

let shouldLogStyleWarn = true

module.exports = function(src, filePath, config) {
  const vueJestConfig = getVueJestConfig(config)
  const parts = compilerUtils.parse({
    source: src,
    compiler: VueTemplateCompiler,
    filename: filePath
  })
  let scriptSrcContent = src
  let sourceMapPath = filePath

  if (parts.script && parts.script.src) {
    const externalScrPath = join(filePath, '..', parts.script.src)

    parts.script.content = fs.readFileSync(externalScrPath, 'utf8')
    scriptSrcContent = parts.script.content
    sourceMapPath = externalScrPath
  }

  const result = processScript(parts.script, filePath, config)
  let compiledScriptContent = result.code
  compiledScriptContent = compiledScriptContent.slice(
    0,
    compiledScriptContent.indexOf('//# sourceMappingURL')
  )
  const inputMap = result.map

  const map = generateSourceMap(
    compiledScriptContent,
    sourceMapPath,
    scriptSrcContent,
    inputMap
  )

  let output = `var exports = {}
        ${compiledScriptContent}
        if(!exports.default) {
          exports.default = {}
        }
        var __options__ = module.exports = exports.default
        Object.keys(exports).forEach(k => module.exports[k] = exports[k])`

  if (parts.template) {
    parts.template.filename = filePath
    if (parts.template.src) {
      parts.template.filename = join(filePath, '..', parts.template.src)
      parts.template.content = fs.readFileSync(parts.template.filename, 'utf8')
    }

    const templateResult = compilerUtils.compileTemplate({
      source: parts.template.content,
      compiler: VueTemplateCompiler,
      filename: parts.template.filename,
      isFunctional: parts.template.attrs.functional,
      preprocessLang: parts.template.lang,
      preprocessOptions: vueJestConfig[parts.template.lang]
    })

    if (templateResult.errors.length) {
      templateResult.errors.forEach(function(msg) {
        console.error('\n' + chalk.red(msg) + '\n')
      })
      throwError('Vue template compilation failed')
    }

    output += `
      ${templateResult.code}
      __options__.render = render
      __options__.staticRenderFns = staticRenderFns
      `

    if (parts.template.attrs.functional) {
      output += '__options__.functional = true\n'
      output += '__options__._compiled = true\n'
    }

    if (map) {
      const beforeLines = output.split(splitRE).length
      addTemplateMapping(compiledScriptContent, parts, output, map, beforeLines)
    }
  }

  if (Array.isArray(parts.styles) && parts.styles.length > 0) {
    if (
      parts.styles.some(ast => /^less|pcss|postcss/.test(ast.lang)) &&
      shouldLogStyleWarn
    ) {
      !vueJestConfig.hideStyleWarn &&
        warn('Less and PostCSS are not currently compiled by vue-jest')
      shouldLogStyleWarn = false
    }

    const styleStr = parts.styles
      .filter(ast => ast.module)
      .map(ast => {
        const styleObj = /^less|pcss|postcss/.test(ast.lang)
          ? {}
          : processStyle(ast, filePath, config)

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
      if (parts.template && parts.template.attrs.functional) {
        output += `
        ;(function() {
          var originalRender = __options__.render
          var styleFn = function () { ${styleStr} }
          __options__.render = function renderWithStyleInjection (h, context) {
            styleFn.call(context)
            return originalRender(h, context)
          }
        })()
        `
      } else {
        output += `
        ;(function() {
          var beforeCreate = __options__.beforeCreate
          var styleFn = function () { ${styleStr} }
          __options__.beforeCreate = beforeCreate ? [].concat(beforeCreate, styleFn) : [styleFn]
        })()
        `
      }
    }
  }

  if (map) {
    output += '\n' + convertSourceMap.fromJSON(map.toString()).toComment()
  }

  return { code: output, map }
}
