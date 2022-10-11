const ensureRequire = require('./ensure-require')
const throwError = require('./throw-error')
const constants = require('./constants')
const loadPartialConfig = require('@babel/core').loadPartialConfig
const { resolveSync: resolveTsConfigSync } = require('tsconfig')
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
    (jestConfig &&
      jestConfig.config &&
      jestConfig.config.globals &&
      jestConfig.config.globals['vue-jest']) ||
    {}
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

const tsConfigCache = new Map()

/**
 * Load TypeScript config from tsconfig.json.
 * @param {string | undefined} path tsconfig.json file path (default: root)
 * @returns {import('typescript').TranspileOptions | null} TypeScript compilerOptions or null
 */
const getTypeScriptConfig = function getTypeScriptConfig(path) {
  if (tsConfigCache.has(path)) {
    return tsConfigCache.get(path)
  }

  ensureRequire('typescript', ['typescript'])
  const typescript = require('typescript')

  const tsconfigPath = resolveTsConfigSync(process.cwd(), path || '')
  if (!tsconfigPath) {
    warn(`Not found tsconfig.json.`)
    return null
  }

  const parsedConfig = typescript.getParsedCommandLineOfConfigFile(
    tsconfigPath,
    {},
    {
      ...typescript.sys,
      onUnRecoverableConfigFileDiagnostic: e => {
        const errorMessage = typescript.formatDiagnostic(e, {
          getCurrentDirectory: () => process.cwd(),
          getNewLine: () => `\n`,
          getCanonicalFileName: file => file.replace(/\\/g, '/')
        })
        warn(errorMessage)
      }
    }
  )

  const compilerOptions = parsedConfig ? parsedConfig.options : {}

  const transpileConfig = {
    compilerOptions: {
      ...compilerOptions,
      // Force es5 to prevent const vue_1 = require('vue') from conflicting
      target: typescript.ScriptTarget.ES5,
      module: typescript.ModuleKind.CommonJS
    }
  }

  tsConfigCache.set(path, transpileConfig)

  return transpileConfig
}

function isValidTransformer(transformer) {
  return (
    isFunction(transformer.createTransformer) ||
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
  transform = { ...constants.defaultVueJestConfig.transform, ...transform }

  const transformerPath = fetchTransformer(lang, transform)

  if (!transformerPath) {
    return null
  }

  let transformer
  if (
    typeof transformerPath === 'string' &&
    require(resolvePath(transformerPath))
  ) {
    transformer = require(resolvePath(transformerPath))
    transformer = transformer.default || transformer
  } else if (typeof transformerPath === 'object') {
    transformer = transformerPath
  }

  if (!isValidTransformer(transformer)) {
    throwError(
      `transformer must contain at least one createTransformer(), process(), preprocess(), or postprocess() method`
    )
  }

  return isFunction(transformer.createTransformer)
    ? transformer.createTransformer()
    : transformer
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

const loadSrc = (src, filePath) => {
  var dir = path.dirname(filePath)
  var srcPath = path.resolve(dir, src)
  try {
    return fs.readFileSync(srcPath, 'utf-8')
  } catch (e) {
    throwError(
      'Failed to load src: "' + src + '" from file: "' + filePath + '"'
    )
  }
}

module.exports = {
  stripInlineSourceMap,
  throwError,
  logResultErrors,
  getCustomTransformer,
  getTypeScriptConfig,
  getBabelOptions,
  getVueJestConfig,
  transformContent,
  info,
  warn,
  resolvePath,
  fetchTransformer,
  loadSrc
}
