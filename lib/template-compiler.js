var chalk = require('chalk')
var vueCompiler = require('vue-template-compiler')
var transpile = require('vue-template-es2015-compiler')
var compilePug = require('./compilers/pug-compiler')

function getTemplateContent(templatePart) {
  if(templatePart.lang === 'pug') {
    return compilePug(templatePart.content)
  }
  return templatePart.content
}

module.exports = function compileTemplate (templatePart, compiler) {
  var templateContent = getTemplateContent(templatePart)

  var compiled = vueCompiler.compile(templateContent)
  if (compiled.errors.length) {
    compiled.errors.forEach(function (msg) {
      console.error('\n' + chalk.red(msg) + '\n')
    })
    throw new Error('Vue template compilation failed')
  } else {
    return {
      render: toFunction(compiled.render),
      staticRenderFns: '[' + compiled.staticRenderFns.map(toFunction).join(',') + ']'
    }
  }
}

function toFunction (code) {
  return transpile('function render () {' + code + '}')
}
