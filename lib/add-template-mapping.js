const splitRE = /\r?\n/g

module.exports = function addTemplateMapping(
  content,
  parts,
  output,
  map,
  beforeLines
) {
  const afterLines = output.split(splitRE).length
  const templateLine = content.slice(0, parts.template.start).split(splitRE)
    .length
  for (; beforeLines < afterLines; beforeLines++) {
    map.addMapping({
      source: map._filename,
      generated: {
        line: beforeLines,
        column: 0
      },
      original: {
        line: templateLine,
        column: 0
      }
    })
  }
}
