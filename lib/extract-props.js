module.exports = function extractProps (content) {
  const DETECT_PROP_DEFINITIONS = /(props\..*?)(}| |\.|\[)/g
  const CHARS_TO_REMOVE = /(\.|}| |props|\(|\[)/g
  const propDefinitions = content.match(DETECT_PROP_DEFINITIONS)
  if (!propDefinitions) return '{}'
  let props = propDefinitions.map((match) => {
    const propName = match.trim().replace(CHARS_TO_REMOVE, '')
    return `'${propName}'`
  })
  props = removeDuplicates(props)
  return `[ ${props.join(', ')} ]`
}

function removeDuplicates (props) {
  return [...new Set(props)]
}
