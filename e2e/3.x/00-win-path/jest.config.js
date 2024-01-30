const vTestDirective = require('./v-test-directive')

module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'json', 'vue', 'ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue3-jest'
  },
  moduleNameMapper: {
    '^~?__styles/(.*)$': '<rootDir>/components/styles/$1'
  },
  globals: {
    'vue-jest': {
      compilerOptions: {
        directiveTransforms: {
          test: vTestDirective
        }
      }
    }
  }
}
