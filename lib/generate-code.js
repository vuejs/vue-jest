module.exports = function generateCode(
  { scriptResult, scriptSetupResult },
  templateResult,
  stylesResult,
  customBlocksResult,
  isFunctional
) {
  let output = ''

  if (scriptResult) {
    output += `${scriptResult.code};\n`
  }

  if (scriptSetupResult) {
    output += `${scriptSetupResult.code};\n`
  }

  if (templateResult) {
    output += `${templateResult.code};\n`
  }

  if (output.includes('exports.render = render;')) {
    output += ';exports.default = {...exports.default, render};'
  } else {
    output += ';exports.default = {...exports.default};'
  }

  return {
    code: output
  }
}
