const ensureRequire = require('../ensure-require')
const compileBabel = require('./babel-compiler')
const tsconfig = require('tsconfig')

module.exports = function compileTypescript (scriptContent) {
  ensureRequire('typescript', ['typescript'])
  const typescript = require('typescript')
  const file = tsconfig.loadSync(process.cwd())

  const res = typescript.transpileModule(scriptContent, file.config)

  return compileBabel(res.outputText, res.sourceMapText)
}
