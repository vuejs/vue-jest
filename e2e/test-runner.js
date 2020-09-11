const { spawnSync } = require('child_process')
const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')

const IGNORE_FILES = ['.DS_Store']
const cwd = process.cwd()

const jestVersion = process.env.JEST_VERSION || '^25.5.0'

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

    log('Removing package-lock.json')
    fs.removeSync(`${resolvedPath}/package-lock.json`)

    log('Installing node_modules')
    run(`npm install --silent`)
  }

  log(`Installing jest@${jestVersion}`)
  run(`npm install jest@${jestVersion} --save-dev --silent`)

  // For tests that need vue-jest to successfully `require.resolve()` a file in
  // the project directory's node_modules, we can't symlink vue-jest from a
  // parent directory (as node module resolution walks up the file tree,
  // starting from the realpath of the caller), we must copy it.
  if (
    !fs.existsSync(`${resolvedPath}/node_modules/vue-jest`) ||
    !fs.lstatSync(`${resolvedPath}/node_modules/vue-jest`).isSymbolicLink()
  ) {
    log('Copying vue-jest into node_modules')
    fs.mkdirSync(`${resolvedPath}/node_modules/vue-jest`, { recursive: true })
    run(`cp ${cwd}/package.json node_modules/vue-jest/`)
    run(`cp -r ${cwd}/lib node_modules/vue-jest/`)
  }

  log('Running tests')
  run('npm test')

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
