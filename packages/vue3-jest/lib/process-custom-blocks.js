const { getVueJestConfig, getCustomTransformer } = require('./utils')

function applyTransformer(
  transformer,
  blocks,
  componentNamespace,
  filename,
  config
) {
  return transformer.process({ blocks, componentNamespace, filename, config })
}

function groupByType(acc, block) {
  acc[block.type] = acc[block.type] || []
  acc[block.type].push(block)
  return acc
}

module.exports = (allBlocks, filename, componentNamespace, config) => {
  const blocksByType = allBlocks.reduce(groupByType, {})
  const codes = []
  for (const [type, blocks] of Object.entries(blocksByType)) {
    const transformer = getCustomTransformer(
      getVueJestConfig(config).transform,
      type
    )
    if (transformer) {
      const codeStr = applyTransformer(
        transformer,
        blocks,
        componentNamespace,
        filename,
        config
      )
      codes.push(codeStr)
    }
  }
  return codes
}
