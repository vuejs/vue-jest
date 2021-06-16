const fs = require('fs')

const testDir = 'node_modules/vue-jest-test'

if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir)
}

fs.openSync('/tmp/absolute.scss', 'w')
fs.openSync(`${testDir}/_partial.scss`, 'w')
fs.openSync(`${testDir}/foo.bar.scss`, 'w')
fs.openSync(`${testDir}/baz.css`, 'w')
fs.openSync(`${testDir}/qux.sass`, 'w')
