const { createTransformer } = require('babel-jest').default
module.exports = createTransformer({
  presets: ['@babel/preset-env']
})
