const loadPartialConfig = require('@babel/core').loadPartialConfig
const ensureRequire = require('./ensure-require')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')

const fetchTransformer = function fetchTransformer(key, obj) {
  for (const exp in obj) {
    const matchKey = new RegExp(exp)
    if (matchKey.test(key)) {
      return obj[exp]
    }
  }
  return null
}

const resolvePath = function resolvePath(pathToResolve) {
  return /^(\.\.\/|\.\/|\/)/.test(pathToResolve)
    ? path.resolve(process.cwd(), pathToResolve)
    : pathToResolve
}

const info = function info(msg) {
  console.info(chalk.blue('\n[vue-jest]: ' + msg + '\n'))
}

const warn = function warn(msg) {
  console.warn(chalk.red('\n[vue-jest]: ' + msg + '\n'))
}

const transformContent = function transformContent(
  content,
  filePath,
  config,
  transformer,
  attrs
) {
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
const getBabelOptions = function loadBabelOptions(filename, options = {}) {
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

function isValidTransformer(transformer) {
  return (
    isFunction(transformer.process) ||
    isFunction(transformer.postprocess) ||
    isFunction(transformer.preprocess)
  )
}

const isFunction = fn => typeof fn === 'function'

const getCustomTransformer = function getCustomTransformer(
  transform = {},
  lang
) {
  let transformerPath = fetchTransformer(lang, transform)
  if (transformerPath) {
    const transformer = require(resolvePath(transformerPath))

    if (!isValidTransformer(transformer)) {
      throwError(
        `transformer must contain at least one process, preprocess, or ` +
          `postprocess method`
      )
    }
    return transformer
  }
  return null
}

const throwError = function error(msg) {
  throw new Error('\n[vue-jest] Error: ' + msg + '\n')
}

const stripInlineSourceMap = function(str) {
  return str.slice(0, str.indexOf('//# sourceMappingURL'))
}

const logResultErrors = result => {
  if (result.errors.length) {
    result.errors.forEach(function(msg) {
      console.error('\n' + chalk.red(msg) + '\n')
    })
    throwError('Vue template compilation failed')
  }
}

const getTSBabelOptions = () => {
  const ts = getTsInstance()
  const { compilerOptions } = getTsConfig()
  const TSBabelOptions = {
    presets: [
      '@babel/env',
      ['@babel/preset-typescript', { allExtensions: true }]
    ],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-syntax-dynamic-import',
      ['@babel/plugin-transform-runtime', { corejs: 2 }]
    ]
  }
  if (compilerOptions.module === ts.ModuleKind.CommonJS) {
    TSBabelOptions.plugins.push('@babel/plugin-transform-modules-commonjs')
  }
  return TSBabelOptions
}

const getTsConfig = function getTsConfig(
  pathToConfig = path.resolve(process.cwd(), './tsconfig.json')
) {
  const ts = getTsInstance()
  if (!fs.existsSync(pathToConfig)) {
    return { compilerOptions: {} }
  }
  const configJson = ts.parseConfigFileTextToJson(
    pathToConfig,
    ts.sys.readFile(pathToConfig)
  )
  const { options: compilerOptions } = ts.parseJsonConfigFileContent(
    configJson.config,
    ts.sys,
    ts.getDirectoryPath(pathToConfig),
    {},
    pathToConfig
  )
  return { compilerOptions }
}

const getTsInstance = function getTSInstance() {
  ensureRequire('typescript', ['typescript'])
  return require('typescript')
}

module.exports = {
  stripInlineSourceMap,
  throwError,
  logResultErrors,
  getCustomTransformer,
  getTSBabelOptions,
  getBabelOptions,
  getVueJestConfig,
  transformContent,
  info,
  warn,
  resolvePath,
  fetchTransformer
}
