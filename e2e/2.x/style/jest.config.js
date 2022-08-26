const os = require('node:os')

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue2-jest'
  },
  moduleNameMapper: {
    '^~tmp/(.*)': `${os.tmpdir()}/$1`,
    '^~?__styles/(.*)$': '<rootDir>/components/styles/$1'
  },
  globals: {
    'vue-jest': {
      resources: {
        scss: ['variables.scss'],
        less: ['variables.less']
      }
    }
  }
}
