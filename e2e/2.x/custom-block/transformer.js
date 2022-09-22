function convert(content) {
  return JSON.stringify(JSON.parse(content))
    .replace(/\u2028/g, '\\u2028') // LINE SEPARATOR
    .replace(/\u2029/g, '\\u2029') // PARAGRAPH SEPARATOR
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
}

module.exports = {
  process({ blocks, vueOptionsNamespace, filename, config }) {
    const ret = blocks.reduce((codes, block) => {
      codes.push(
        `${vueOptionsNamespace}.__custom = ${vueOptionsNamespace}.__custom || [];${vueOptionsNamespace}.__custom.push(${convert(
          block.content
        )});`
      )
      return codes
    }, [])
    return ret.join('')
  }
}
