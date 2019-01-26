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
const logResultErrors = require('./utils').logResultErrors
const getCustomTransformer = require('./utils').getCustomTransformer
const stripInlineSourceMap = require('./utils').stripInlineSourceMap
const transformContent = require('./utils').transformContent
const splitRE = /\r?\n/g
const babelJest = require('babel-jest')
const compilerUtils = require('@vue/component-compiler-utils')
const convertSourceMap = require('convert-source-map')

/**
 * Transforms content using custom transformer.
 *
 * @param {Object} content - content to be transformed
 * @param {String} filePath - absolute path to the file
 * @param {Object} config- jest configuration
 * @param {Function} transformer - custom transformer function
 * @param {Object} attrs - attributes
 * @returns {Object|string} content - Transformed content
 */
function processScriptBytransforms(
  content,
  filePath,
  config,
  transforms = {},
  attrs
) {
  const preProcessedContent = transformContent(
    content,
    filePath,
    config,
    transforms.preProcess,
    attrs
  )
  const processedContent = transformContent(
    preProcessedContent,
    filePath,
    config,
    transforms.process,
    attrs
  )
  return transformContent(
    processedContent,
    filePath,
    config,
    transforms.postProcess,
    attrs
  )
}

function processScript(scriptPart, filePath, config) {
  if (!scriptPart) {
    return {
      code: ''
    }
  }
  const { content, lang = 'js', attrs } = scriptPart
  const vueJestConfig = getVueJestConfig(config)
  const transforms = getCustomTransformer(vueJestConfig['transform'], lang)
  // script has custom transformer
  if (transforms.process) {
    return transformContent(
      content,
      filePath,
      config,
      transforms.process,
      attrs
    )
  } else if (/^typescript$|tsx?$/.test(lang)) {
    return processScriptBytransforms(
      content,
      filePath,
      config,
      {
        process: compileTypescript
      },
      attrs
    )
  } else if (/^coffee$|coffeescript$/.test(lang)) {
    return processScriptBytransforms(
      content,
      filePath,
      config,
      {
        process: compileCoffeeScript
      },
      attrs
    )
  }

  return processScriptBytransforms(content, filePath, config, babelJest, attrs)
}

module.exports = function(src, filePath, config) {
  const vueJestConfig = getVueJestConfig(config)
  const descriptor = compilerUtils.parse({
    source: src,
    compiler: VueTemplateCompiler,
    filename: filePath
  })
  let scriptSrcContent = src
  let sourceMapPath = filePath

  if (descriptor.script && descriptor.script.src) {
    const externalScrPath = join(filePath, '..', descriptor.script.src)

    descriptor.script.content = fs.readFileSync(externalScrPath, 'utf8')
    scriptSrcContent = descriptor.script.content
    sourceMapPath = externalScrPath
  }

  const result = processScript(descriptor.script, filePath, config)
  let compiledScriptContent = result.code
  compiledScriptContent = stripInlineSourceMap(compiledScriptContent)
  const inputMap = result.map

  const map = generateSourceMap(
    compiledScriptContent,
    sourceMapPath,
    scriptSrcContent,
    inputMap
  )

  let output = ''

  if (compiledScriptContent) {
    output += `${compiledScriptContent};\n`
  } else {
    output +=
      `Object.defineProperty(exports, "__esModule", {\n` +
      `  value: true\n` +
      `});\n` +
      'module.exports.default = {};\n'
  }

  output +=
    `var __options__ = typeof exports.default === 'function'\n` +
    `? exports.default.options\n` +
    `: exports.default\n`

  if (descriptor.template) {
    descriptor.template.filename = filePath
    if (descriptor.template.src) {
      descriptor.template.filename = join(
        filePath,
        '..',
        descriptor.template.src
      )
      descriptor.template.content = fs.readFileSync(
        descriptor.template.filename,
        'utf8'
      )
    }

    const templateResult = compilerUtils.compileTemplate({
      source: descriptor.template.content,
      compiler: VueTemplateCompiler,
      filename: descriptor.template.filename,
      isFunctional: descriptor.template.attrs.functional,
      preprocessLang: descriptor.template.lang,
      preprocessOptions: vueJestConfig[descriptor.template.lang]
    })

    logResultErrors(templateResult)

    output +=
      `${templateResult.code}\n` +
      `__options__.render = render\n` +
      `__options__.staticRenderFns = staticRenderFns\n`

    if (descriptor.template.attrs.functional) {
      output += '__options__.functional = true\n'
      output += '__options__._compiled = true\n'
    }

    if (map) {
      const beforeLines = output.split(splitRE).length
      addTemplateMapping(
        compiledScriptContent,
        descriptor,
        output,
        map,
        beforeLines
      )
    }
  }

  if (Array.isArray(descriptor.styles) && descriptor.styles.length > 0) {
    const styleStr = descriptor.styles
      .filter(ast => ast.module)
      .map(ast => {
        const styleObj = processStyle(ast, filePath, config)
        const moduleName = ast.module === true ? '$style' : ast.module

        return (
          `if(!this['${moduleName}']) {\n` +
          `  this['${moduleName}'] = {};\n` +
          `}\n` +
          `this['${moduleName}'] = Object.assign(\n` +
          `this['${moduleName}'], ${JSON.stringify(styleObj)});\n`
        )
      })
      .filter(_ => _)
      .join('')

    if (styleStr.length !== 0) {
      if (descriptor.template && descriptor.template.attrs.functional) {
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
  }

  if (map) {
    output += '\n' + convertSourceMap.fromJSON(map.toString()).toComment()
  }

  return {
    code: output,
    map
  }
}
