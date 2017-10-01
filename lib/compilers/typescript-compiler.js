const ensureRequire = require('../ensure-require')
const compileBabel = require('./babel-compiler')
const tsconfig = require('tsconfig')
const cache = require('../cache')
const logger = require('../logger')

const defaultTypescriptConfig = {
  'compilerOptions': {
    'module': 'es2015',
    'moduleResolution': 'node',
    'allowSyntheticDefaultImports': true,
    'strict': true,
    'noEmit': true
  },
  'include': [
    '**/*.ts'
  ]
}

function getTypescriptConfig () {
  // const cachedConfig = cache.get('typescript-config')
  // if (cachedConfig) {
  //   return cachedConfig
  // } else {
  const { config } = tsconfig.loadSync(process.cwd())

  if (!config) {
    logger.info('no tsconfig.json found, defaulting to default typescript options')
  }

  const typescriptConfig = config || defaultTypescriptConfig
  cache.set('typescript-config', typescriptConfig)
  return typescriptConfig
  // }
}

module.exports = function compileTypescript (scriptContent) {
  ensureRequire('typescript', ['typescript'])
  const typescript = require('typescript')
  const tsConfig = getTypescriptConfig()

  const res = typescript.transpileModule(scriptContent, tsConfig)

  return compileBabel(res.outputText, res.sourceMapText)
}
