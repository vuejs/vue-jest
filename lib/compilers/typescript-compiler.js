const typescript = require('typescript')

module.exports = function compileTypescript (scriptContent) {
  const res = typescript.transpileModule(scriptContent,{"compilerOptions": {
    "sourceMap": true
    }})

  return {
    code: res.outputText,
    sourceMap: res.sourceMapText
  }
}
