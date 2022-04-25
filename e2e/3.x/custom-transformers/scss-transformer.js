const cssTree = require('css-tree')

module.exports = {
  preprocess: function preprocess(src, filepath, config, attrs) {
    return `${src}\n .g{width: 10px}`
  },
  postprocess: function postprocess(src, filepath, config, attrs) {
    const ast = cssTree.parse(src)
    const obj = cssTree
      .findAll(ast, node => node.type === 'ClassSelector')
      .reduce((acc, cssNode) => {
        acc[cssNode.name] = cssNode.name

        return acc
      }, {})

    if (!attrs.themed) {
      return JSON.stringify(obj)
    }

    return JSON.stringify({
      light: obj,
      dark: obj
    })
  }
}
