import { shallow, mount } from 'vue-test-utils'
import Coffee from './resources/Coffee.vue'
import CoffeeScript from './resources/CoffeeScript.vue'
import CoffeeES6 from './resources/CoffeeES6.vue'
import CoffeeScriptES6 from './resources/CoffeeScriptES6.vue'
import jestVue from '../vue-jest'
import { resolve } from 'path'
import {
  readFileSync,
  writeFileSync,
  renameSync
} from 'fs'
import clearModule from 'clear-module'
import cache from '../lib/cache'

describe('Test CoffeeScript - coffee.spec.js', () => {
  beforeEach(() => {
    cache.flushAll()
    clearModule.all()
  })

  test('processes .vue file with lang set to coffee', () => {
    shallow(Coffee)
  })

  test('processes .vue file with lang set to coffeescript', () => {
    shallow(CoffeeScript)
  })

  test('processes .vue file with lang set to coffee (ES6)', () => {
    shallow(CoffeeES6)
  })

  test('processes .vue file with lang set to coffeescript (ES6)', () => {
    shallow(CoffeeScriptES6)
  })

  test('processes .vue file with lang set to coffeescript (ES6)', () => {
    const wrapper = mount(CoffeeScriptES6)
    expect(typeof wrapper).toBe('object')
  })

  test('processes .vue files with lang set to coffeescript using .babelrc if there is no .babelrc', () => {
    const babelRcPath = resolve(__dirname, '../.babelrc')
    const tempPath = resolve(__dirname, '../.renamed')
    renameSync(babelRcPath, tempPath)
    const filePath = resolve(__dirname, './resources/CoffeeScriptES6.vue')
    const fileString = readFileSync(filePath, { encoding: 'utf8' })
    try {
      jestVue.process(fileString, filePath)
    } catch (err) {
      renameSync(tempPath, babelRcPath)
      throw err
    }
    renameSync(tempPath, babelRcPath)
  })

  test('processes .vue files with lang set to coffeescript, uses babelrc in package.json if none in .babelrc', () => {
    const babelRcPath = resolve(__dirname, '../.babelrc')
    const tempPath = resolve(__dirname, '../.renamed')
    const packagePath = resolve(__dirname, '../package.json')
    const packageOriginal = readFileSync(packagePath, { encoding: 'utf8' })
    writeFileSync(packagePath, '{ "babel": {"presets": ["env"],"plugins": ["istanbul"]}}')
    renameSync(babelRcPath, tempPath)
    const filePath = resolve(__dirname, './resources/CoffeeScriptES6.vue')
    const fileString = readFileSync(filePath, { encoding: 'utf8' })

    try {
      const output = jestVue.process(fileString, filePath)
      expect(output.code).toContain('coverageData.hash')
    } catch (err) {
      renameSync(tempPath, babelRcPath)
      writeFileSync(packagePath, packageOriginal)
      jest.resetModules()
      throw err
    }
    renameSync(tempPath, babelRcPath)
    writeFileSync(packagePath, packageOriginal)
    jest.resetModules()
  })

  test('processes .vue files with lang set to coffeescript using .babelrc if it exists in route', () => {
    const babelRcPath = resolve(__dirname, '../.babelrc')
    const babelRcOriginal = readFileSync(babelRcPath, { encoding: 'utf8' })
    writeFileSync(babelRcPath, '{"presets": ["env"],"plugins": ["istanbul"]}')
    const filePath = resolve(__dirname, './resources/CoffeeScriptES6.vue')
    const fileString = readFileSync(filePath, { encoding: 'utf8' })

    const output = jestVue.process(fileString, filePath)
    writeFileSync(babelRcPath, babelRcOriginal)
    // coverageData.hash is added by babel-plugin-istanbul, added to root .babelrc for this test only
    expect(output.code).toContain('coverageData.hash')
  })
})
