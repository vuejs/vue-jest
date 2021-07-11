function convert(content) {
  return JSON.stringify(JSON.parse(content))
    .replace(/\u2028/g, '\\u2028') // LINE SEPARATOR
    .replace(/\u2029/g, '\\u2029') // PARAGRAPH SEPARATOR
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
}

module.exports = {
  process({ blocks, componentNamespace, filename, config }) {
    const ret = blocks.reduce((codes, block) => {
      codes.push(
        `${componentNamespace}.__custom = ${componentNamespace}.__custom || [];${componentNamespace}.__custom.push(${convert(
          block.content
        )});`
      )
      return codes
    }, [])
    return ret
  }
}
