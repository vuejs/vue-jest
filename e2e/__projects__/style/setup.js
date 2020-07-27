const fs = require('fs')

const testDir = 'node_modules/vue-jest-test'

if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir)
}

fs.openSync(`${testDir}/_partial.scss`, 'w')
