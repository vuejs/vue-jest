module.exports = function extractProps(content) {
  const DETECT_PROP_DEFINITIONS = /(props\..*?)(}| |\.)/g
  const CHARS_TO_REMOVE = /(\.|}| |props)/g
  const propDefinitions = content.match(DETECT_PROP_DEFINITIONS)
  if (!propDefinitions) return '{}'
  const props = propDefinitions.map((match) => {
    const propName = match.trim().replace(CHARS_TO_REMOVE, '')
    return `'${propName}'`
  })
  return `[ ${props.join(', ')} ]`
}
