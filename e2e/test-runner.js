const { spawnSync } = require('child_process')
const path = require('path')
// const os =  require('os')
const fs = require('fs')

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

  run('rm -rf node_modules package-lock.json')
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
