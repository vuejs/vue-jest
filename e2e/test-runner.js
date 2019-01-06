const { spawnSync } = require('child_process')
const path = require('path')
const fs = require('fs-extra')
const info = require('../lib/utils').info
const success = require('../lib/utils').success

const IGNORE_FILES = ['.DS_Store']

function runTest(dir) {
  const resolvedPath = path.resolve(__dirname, '__projects__', dir)

  const run = command => {
    const [cmd, ...args] = command.split(' ')
    const { status } = spawnSync(cmd, args, {
      cwd: resolvedPath,
      env: { PATH: process.env.PATH },
      stdio: 'inherit',
      shell: true
    })
    if (status !== 0) {
      process.exit(status)
    }
  }

  const log = msg => info(`(${dir}) ${msg}`)

  log('Running tests')

  log('Removing node_modules')
  fs.removeSync(`${resolvedPath}/node_modules`)

  log('Removing package-lock.json')
  fs.removeSync(`${resolvedPath}/package-lock.json`)

  log('Installing node_modules')
  run('npm install --silent')

  log('Running tests')
  run('npm run test')

  success(`(${dir}) Complete`)
}

async function testRunner(dir) {
  const directories = fs
    .readdirSync(path.resolve(__dirname, '__projects__'))
    .filter(d => !IGNORE_FILES.includes(d))

  directories.forEach(runTest)
}

testRunner()
