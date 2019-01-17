const { createTransformer } = require('babel-jest')
module.exports = createTransformer({
  presets: ['@babel/preset-env'],
  plugins: ['transform-vue-jsx']
})
