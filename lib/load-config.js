const path = require('path')
const fs = require('fs')

module.exports = function loadConfig () {
  const initConfig = {
    resources: {}
  }

  const rootPJSONPath = path.resolve(process.cwd(), 'package.json')
  if (!fs.existsSync(rootPJSONPath)) return initConfig

  const vueJestConfig = require(rootPJSONPath).vueJest

  return Object.assign(initConfig, vueJestConfig)
}
