const typescript = require('typescript')

module.exports = function compileTypescript (scriptContent) {
  return {
    code: typescript.transpile(scriptContent)
  }
}
