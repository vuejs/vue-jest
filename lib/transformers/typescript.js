const ensureRequire = require('../ensure-require')
const babelJest = require('babel-jest')
const {
  getBabelOptions,
  getTsJestConfig,
  stripInlineSourceMap,
  getCustomTransformer,
  getVueJestConfig,
  warn
} = require('../utils')

function getDiagnostics(tsBlob, options, ts) {
  ensureRequire('tempy', ['tempy'])
  const tempy = require('tempy')

  const temp = tempy.writeSync(tsBlob, { extension: 'ts' })
  let program = ts.createProgram([temp], options)
  let emitResult = program.emit()

  let allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    // TODO: tell TS about .vue files
    .filter(
      x => x.messageText && !x.messageText.match(/Cannot find module.*vue/)
    )

  return allDiagnostics
}

function logDiagnostics(filename, diagnostics, ts) {
  diagnostics.forEach(diagnostic => {
    if (diagnostic.file) {
      let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start
      )
      let message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        '\n'
      )
      warn(`${filename} (${line + 1},${character + 1}): ${message}`)
    } else {
      warn(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
    }
  })
}

module.exports = {
  process(scriptContent, filePath, config) {
    ensureRequire('typescript', ['typescript'])
    const typescript = require('typescript')
    const vueJestConfig = getVueJestConfig(config)
    const tsconfig = getTsJestConfig(config)
    const babelOptions = getBabelOptions(filePath)

    if (vueJestConfig.enableExperimentalTsDiagnostics) {
      const diagnostics = getDiagnostics(
        scriptContent,
        { ...tsconfig, noEmitOnError: true },
        typescript
      )
      logDiagnostics(filePath, diagnostics, typescript)

      if (diagnostics.length) {
        // This means there was an error
        // TODO: correct behavior should be?
        // for now, just run the test anyway
      }
    }

    const res = typescript.transpileModule(scriptContent, tsconfig)

    res.outputText = stripInlineSourceMap(res.outputText)

    const inputSourceMap =
      res.sourceMapText !== undefined ? JSON.parse(res.sourceMapText) : ''

    // handle ES modules in TS source code in case user uses non commonjs module
    // output and there is no .babelrc.
    let inlineBabelOptions = {}
    if (
      tsconfig.compilerOptions.module !== typescript.ModuleKind.CommonJS &&
      !babelOptions
    ) {
      inlineBabelOptions = {
        plugins: [require('@babel/plugin-transform-modules-commonjs')]
      }
    }
    const customTransformer =
      getCustomTransformer(vueJestConfig['transform'], 'js') || {}
    const transformer = customTransformer.process
      ? customTransformer
      : babelJest.createTransformer(
          Object.assign(inlineBabelOptions, {
            inputSourceMap
          })
        )

    return transformer.process(res.outputText, filePath, config)
  }
}
