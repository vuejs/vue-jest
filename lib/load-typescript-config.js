const tsconfig = require('tsconfig')
const cache = require('./cache')
const logger = require('./logger')

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

module.exports.loadTypescriptConfig = function loadTypescriptConfig () {
  const cachedConfig = cache.get('typescript-config')
  if (cachedConfig) {
    return cachedConfig
  } else {
    const { path, config } = tsconfig.loadSync(process.cwd())

    if (!path) {
      logger.info('no tsconfig.json found, defaulting to default typescript options')
    }

    const typescriptConfig = path ? config : defaultTypescriptConfig
    cache.set('typescript-config', typescriptConfig)
    return typescriptConfig
  }
}

module.exports.defaultConfig = defaultTypescriptConfig
