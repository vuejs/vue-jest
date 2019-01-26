const loadPartialConfig = require('@babel/core').loadPartialConfig
const createTransformer = require('ts-jest').createTransformer
const chalk = require('chalk')
const path = require('path')

const fetchTransformer = function fetchTransformer(key, obj) {
  for (const exp in obj) {
    const matchKey = new RegExp(exp)
    if (matchKey.test(key)) {
      return obj[exp]
    }
  }
  return null;
}

const resolvePath = function isUnassistedLang(pathToResolve) {
  return /^(\.\.\/|\.\/|\/)/.test(pathToResolve) ?
    path.resolve(process.cwd(), pathToResolve) :
    pathToResolve
}

const info = function info(msg) {
  console.info(chalk.blue('\n[vue-jest]: ' + msg + '\n'))
}

const warn = function warn(msg) {
  console.warn(chalk.red('\n[vue-jest]: ' + msg + '\n'))
}

const transformContent = function transformContent(content, filePath, config, transformer, attrs) {
  if (!transformer) {
    return content
  }
  try {
    return transformer(content, filePath, config, attrs)
  } catch (err) {
    warn(`There was an error while compiling ${filePath} ${err}`)
  }
  return content
}

const getVueJestConfig = function getVueJestConfig(jestConfig) {
  return (
    (jestConfig && jestConfig.globals && jestConfig.globals['vue-jest']) || {}
  )
}
const getBabelOptions = function loadBabelOptions(
  filename,
  options = {}
) {
  const opts = Object.assign(options, {
    caller: {
      name: 'vue-jest',
      supportsStaticESM: false
    },
    filename,
    sourceMaps: 'both'
  })
  return loadPartialConfig(opts).options
}

const isUnassistedLang = function isUnassistedLang(lang) {
  return /^less|pcss|postcss/.test(lang)
}

const getTsJestConfig = function getTsJestConfig(config) {
  const tr = createTransformer()
  return tr.configsFor(config)
}

const getCustomTransformer = function getCustomTransformer(transform = {}, lang) {
  let transformerPath = fetchTransformer(lang, transform)
  if (transformerPath) {
    const transformer = require(resolvePath(transformerPath))
    const validTransformer = transformer.process || transformer.postProcess || transformer.preProcess
    if (transformer && validTransformer) {
      return transformer
    }
  }
  return {}
}

const throwError = function error(msg) {
  throw new Error('\n[vue-jest] Error: ' + msg + '\n')
}

const stripInlineSourceMap = function (str) {
  return str.slice(0, str.indexOf('//# sourceMappingURL'))
}

module.exports = {
  stripInlineSourceMap,
  throwError,
  getCustomTransformer,
  getTsJestConfig,
  isUnassistedLang,
  getBabelOptions,
  getVueJestConfig,
  transformContent,
  info,
  warn,
  resolvePath,
  fetchTransformer
}