const { spawnSync } = require('child_process')
const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')

const IGNORE_FILES = ['.DS_Store']
const cwd = process.cwd()
const bin = `${cwd}/node_modules/.bin`
const nyc = `${bin}/nyc --cwd '${cwd}' -n 'lib/**'` // -s

// Can be run as `yarn test:e2e --cache` to forego reinstalling node_modules, or
// `yarn test:e2e <projects dir>`, or `yarn test:e2e --cache <projects dir>`.
const args = process.argv.slice(2)

function success(msg) {
  console.info(chalk.green('\n[vue-jest]: ' + msg + '\n'))
}

function info(msg) {
  console.info(chalk.blue('\n[vue-jest]: ' + msg + '\n'))
}

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

  if (!args.filter(arg => arg === '--cache').length) {
    log('Removing node_modules')
    fs.removeSync(`${resolvedPath}/node_modules`)

    log('Installing node_modules')
    run('yarn install --silent --no-lockfile')
  }

  log('Running tests')
  run(`${nyc} -t ${resolvedPath}/.nyc_output ${bin}/jest --no-cache`)

  success(`(${dir}) Complete`)
}

async function testRunner() {
  const directories = fs
    .readdirSync(path.resolve(__dirname, '__projects__'))
    .filter(d => !IGNORE_FILES.includes(d))

  const matches = args.filter(d => directories.includes(d))

  if (matches.length) {
    matches.forEach(runTest)
  } else {
    directories.forEach(runTest)
  }
}

testRunner()
