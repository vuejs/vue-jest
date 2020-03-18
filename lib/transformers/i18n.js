const JSON5 = require('json5')
const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')

const VUE_I18N_OPTION = '__i18n'

function convert(source, lang) {
  switch (lang) {
    case 'yaml':
    case 'yml':
      return JSON.stringify(yaml.safeLoad(source), undefined, '\t')
    case 'json5':
      return JSON.stringify(JSON5.parse(source))
    default:
      return source
  }
}

// Because the vue-i18n docs do not require a language
// we have to try to parse the content as json first, then fall back to yaml
function parseLanguageAndContent(block, filename) {
  const langKnown = block.attrs && block.attrs.lang
  let content = block.content

  if (block.attrs && block.attrs.src) {
    content = fs.readFileSync(path.resolve(filename, '../', block.attrs.src))
  }

  if (langKnown) {
    return JSON.stringify(JSON.parse(convert(content, langKnown)))
  }

  try {
    return JSON.stringify(JSON.parse(convert(content, 'json')))
  } catch (_) {
    return JSON.stringify(JSON.parse(convert(content, 'yaml')))
  }
}

module.exports = {
  process({ blocks, vueOptionsNamespace, filename }) {
    const base = `${vueOptionsNamespace}.${VUE_I18N_OPTION} = []`
    const codes = blocks.map(block => {
      if (block.type === 'i18n') {
        const value = parseLanguageAndContent(block, filename)
          .replace(/\u2028/g, '\\u2028')
          .replace(/\u2029/g, '\\u2029')
          .replace(/\\/g, '\\\\')
        return `${vueOptionsNamespace}.${VUE_I18N_OPTION}.push('${value.replace(
          /\u0027/g,
          '\\u0027'
        )}')`
      } else {
        return ''
      }
    })

    return codes.length ? [base].concat(codes).join('\n') : ''
  }
}
