const { spawnSync } = require('child_process')
const path = require('path')
const fs = require('fs-extra')

function runTest(dir) {
  const run = command => {
    const [cmd, ...args] = command.split(' '[0])
    const { status } = spawnSync(cmd, args, {
      cwd: dir,
      env: { PATH: process.env.PATH },
      stdio: 'inherit',
      shell: true
    })
    if (status !== 0) {
      throw new Error()
    }
  }

  fs.removeSync(`${dir}/node_modules`)
  fs.removeSync(`${dir}/package-lock.json`)

  run('npm install')
  run('npm run test')
}

async function testRunner(dir) {
  const directories = fs.readdirSync(path.resolve(__dirname, '__projects__'))

  directories.forEach(directory => {
    const resolvedPath = path.resolve(__dirname, '__projects__', directory)
    runTest(path.resolve(__dirname, '__projects__', resolvedPath))
  })
}

testRunner()
