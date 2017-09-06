import Vue from 'vue'
import Basic from './resources/Basic.vue'
import jestVue from '../jest-vue'
import { resolve } from 'path'
import {
  readFileSync,
  writeFileSync,
  renameSync
} from 'fs'

test('processes .vue files', () => {
  const vm = new Vue(Basic).$mount()
  expect(typeof vm.$el).toBe('object')
})

test('processes .vue files with default babel if there is no .babelrc', () => {
  const babelRcPath = resolve(__dirname, '../.babelrc')
  const tempPath = resolve(__dirname, '../.renamed')
  renameSync(babelRcPath, tempPath)
  const filePath = resolve(__dirname, './resources/Basic.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })
  try {
    jestVue.process(fileString, filePath)
  } catch (err) {
    renameSync(tempPath, babelRcPath)
    throw err
  }
  renameSync(tempPath, babelRcPath)
})

test('logs info when there is no .babelrc', () => {
  const babelRcPath = resolve(__dirname, '../.babelrc')
  const tempPath = resolve(__dirname, '../.renamed')
  renameSync(babelRcPath, tempPath)
  const info = jest.spyOn(global.console, 'info')
  const filePath = resolve(__dirname, './resources/Basic.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })

  jestVue.process(fileString, filePath)
  try {
    expect(info).toHaveBeenCalledWith('\n[jest-vue] Info: no .babelrc found, defaulting to default babel options\n')
  } catch (err) {
    renameSync(tempPath, babelRcPath)
    throw err
  }
  renameSync(tempPath, babelRcPath)
  jest.resetModules()
})

test('uses babelrc in package.json if none in .babelrc', () => {
  const babelRcPath = resolve(__dirname, '../.babelrc')
  const tempPath = resolve(__dirname, '../.renamed')
  const packagePath = resolve(__dirname, '../package.json')
  const packageOriginal = readFileSync(packagePath, { encoding: 'utf8' })
  writeFileSync(packagePath, '{ "babel": {"presets": ["es2015"],"plugins": ["istanbul"]}}')
  renameSync(babelRcPath, tempPath)
  const filePath = resolve(__dirname, './resources/Basic.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })

  try {
    const output = jestVue.process(fileString, filePath)
    expect(output).toContain('coverageData.hash')
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

test('processes .vue files using .babelrc if it exists in route', () => {
  const babelRcPath = resolve(__dirname, '../.babelrc')
  const babelRcOriginal = readFileSync(babelRcPath, { encoding: 'utf8' })
  writeFileSync(babelRcPath, '{"presets": ["es2015"],"plugins": ["istanbul"]}')
  const filePath = resolve(__dirname, './resources/Basic.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })

  const output = jestVue.process(fileString, filePath)
  writeFileSync(babelRcPath, babelRcOriginal)
  // coverageData.hash is added by babel-plugin-istanbul, added to root .babelrc for this test only
  expect(output).toContain('coverageData.hash')
})

test('generates inline sourcemap', () => {
  const expectedMap = '//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhc2ljLnZ1ZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQVBBO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQWpCQTs7OztBQVBBO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyI8dGVtcGxhdGU+XG4gICAgPGRpdiBjbGFzcz1cImhlbGxvXCI+XG4gICAgICAgIDxoMSA6Y2xhc3M9XCJoZWFkaW5nQ2xhc3Nlc1wiPnt7IG1zZyB9fTwvaDE+XG4gICAgPC9kaXY+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICAgIGV4cG9ydCBkZWZhdWx0IHtcbiAgICAgICAgbmFtZTogJ2Jhc2ljJyxcbiAgICAgICAgY29tcHV0ZWQ6IHtcbiAgICAgICAgICAgIGhlYWRpbmdDbGFzc2VzOiBmdW5jdGlvbiBoZWFkaW5nQ2xhc3NlcygpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICByZWQ6IHRoaXMuaXNDcmF6eSxcbiAgICAgICAgICAgICAgICAgICAgYmx1ZTogIXRoaXMuaXNDcmF6eSxcbiAgICAgICAgICAgICAgICAgICAgc2hhZG93OiB0aGlzLmlzQ3JhenksXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG1zZzogJ1dlbGNvbWUgdG8gWW91ciBWdWUuanMgQXBwJyxcbiAgICAgICAgICAgICAgICBpc0NyYXp5OiBmYWxzZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgIHRvZ2dsZUNsYXNzOiBmdW5jdGlvbiB0b2dnbGVDbGFzcygpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzQ3JhenkgPSAhdGhpcy5pc0NyYXp5O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICB9O1xuPC9zY3JpcHQ+XG4iXX0='
  const filePath = resolve(__dirname, './resources/Basic.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })
  const output = jestVue.process(fileString, filePath)
  expect(output).toContain(expectedMap)
})
