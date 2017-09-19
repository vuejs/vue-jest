const ensureRequire = require('../ensure-require')

module.exports = function compileTypescript (scriptContent) {
  ensureRequire('typescript', ['typescript'])
  const typescript = require('typescript')

  const res = typescript.transpileModule(scriptContent, { 'compilerOptions': {
    'sourceMap': true
  }})

  return {
    code: res.outputText,
    sourceMap: res.sourceMapText
  }
}
