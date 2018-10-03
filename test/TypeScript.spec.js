import { shallowMount } from '@vue/test-utils'
import { resolve } from 'path'
import TypeScript from './resources/TypeScript.vue'
import jestVue from '../vue-jest'
import { readFileSync, renameSync, writeFileSync } from 'fs'
import cache from '../lib/cache'

beforeEach(() => {
  cache.flushAll()
})

test('processes .vue files', () => {
  shallowMount(TypeScript)
})

test('processes .vue files without .babelrc', () => {
  const babelRcPath = resolve(__dirname, '../.babelrc')
  const tempPath = resolve(__dirname, '../.renamed')
  renameSync(babelRcPath, tempPath)
  shallowMount(TypeScript)
  renameSync(tempPath, babelRcPath)
})

test.skip('generates inline sourcemap', () => {
  const expectedMap = '//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhc2ljLnZ1ZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQVBBO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQWpCQSIsInNvdXJjZXNDb250ZW50IjpbIjx0ZW1wbGF0ZT5cbiAgICA8ZGl2IGNsYXNzPVwiaGVsbG9cIj5cbiAgICAgICAgPGgxIDpjbGFzcz1cImhlYWRpbmdDbGFzc2VzXCI+e3sgbXNnIH19PC9oMT5cbiAgICA8L2Rpdj5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gICAgZXhwb3J0IGRlZmF1bHQge1xuICAgICAgICBuYW1lOiAnYmFzaWMnLFxuICAgICAgICBjb21wdXRlZDoge1xuICAgICAgICAgICAgaGVhZGluZ0NsYXNzZXM6IGZ1bmN0aW9uIGhlYWRpbmdDbGFzc2VzKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHJlZDogdGhpcy5pc0NyYXp5LFxuICAgICAgICAgICAgICAgICAgICBibHVlOiAhdGhpcy5pc0NyYXp5LFxuICAgICAgICAgICAgICAgICAgICBzaGFkb3c6IHRoaXMuaXNDcmF6eSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbXNnOiAnV2VsY29tZSB0byBZb3VyIFZ1ZS5qcyBBcHAnLFxuICAgICAgICAgICAgICAgIGlzQ3Jhenk6IGZhbHNlLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kczoge1xuICAgICAgICAgICAgdG9nZ2xlQ2xhc3M6IGZ1bmN0aW9uIHRvZ2dsZUNsYXNzKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNDcmF6eSA9ICF0aGlzLmlzQ3Jhenk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgIH07XG48L3NjcmlwdD5cbiJdfQ=='
  const filePath = resolve(__dirname, './resources/TypeScript.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })
  const output = jestVue.process(fileString, filePath)
  expect(output).toContain(expectedMap)
})

test('processes without sourcemap', () => {
  const configPath = resolve(__dirname, '../tsconfig.json')
  const tsconfigString = readFileSync(configPath, { encoding: 'utf8' })
  const tsconfig = JSON.parse(tsconfigString)
  tsconfig.compilerOptions.sourceMap = false
  writeFileSync(configPath, JSON.stringify(tsconfig))
  const filePath = resolve(__dirname, './resources/TypeScript.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })

  try {
    expect(() => jestVue.process(fileString, filePath)).not.toThrow()
  } catch (err) {
    writeFileSync(configPath, tsconfigString)
    throw err
  }

  writeFileSync(configPath, tsconfigString)
})
