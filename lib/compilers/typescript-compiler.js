const tsconfig = require('tsconfig')
const ensureRequire = require('../ensure-require')
const compileBabel = require('./babel-compiler')
const loadBabelConfig = require('../load-babel-config.js')
const cache = require('../cache')
const logger = require('../logger')

const defaultTypescriptConfig = {
  'compilerOptions': {
    'target': 'es5',
    'lib': [
      'dom',
      'es6'
    ],
    'module': 'es2015',
    'moduleResolution': 'node',
    'types': ['vue-typescript-import-dts', 'jest', 'node'],
    'isolatedModules': false,
    'experimentalDecorators': true,
    'noImplicitAny': true,
    'noImplicitThis': true,
    'strictNullChecks': true,
    'removeComments': true,
    'emitDecoratorMetadata': true,
    'suppressImplicitAnyIndexErrors': true,
    'allowSyntheticDefaultImports': true,
    'sourceMap': true,
    'allowJs': true
  }
}

function getTypescriptConfig () {
  const cachedConfig = cache.get('typescript-config')
  if (cachedConfig) {
    return cachedConfig
  } else {
    const { config } = tsconfig.loadSync(process.cwd())

    if (!config) {
      logger.info('no tsconfig.json found, defaulting to default typescript options')
    }

    const typescriptConfig = config || defaultTypescriptConfig
    cache.set('typescript-config', typescriptConfig)
    return typescriptConfig
  }
}

module.exports = function compileTypescript (scriptContent) {
  ensureRequire('typescript', ['typescript'])
  const typescript = require('typescript')
  const tsConfig = getTypescriptConfig()

  const res = typescript.transpileModule(scriptContent, tsConfig)
  const inputSourceMap = (res.sourceMapText !== undefined)
    ? JSON.parse(res.sourceMapText)
    : ''

  // handle ES modules in TS source code in case user uses non commonjs module
  // output and there is no .babelrc.
  let inlineBabelConfig
  if (tsConfig.compilerOptions.module !== 'commonjs' && !loadBabelConfig()) {
    inlineBabelConfig = {
      plugins: [
        require('babel-plugin-transform-es2015-modules-commonjs')
      ]
    }
  }

  return compileBabel(res.outputText, inputSourceMap, inlineBabelConfig)
}
