const path = require('path')

module.exports = function loadConfig () {

  let initConfig = {
    resources: {}
  }

  const rootPJSONPath = path.resolve(process.cwd(), 'package.json')
  if (!fs.existsSync(rootPJSONPath)) return initConfig
  
  const vueJestConfig = require(rootPJSONPath).vueJest

  return Object.assign(initConfig, vueJestConfig)
}