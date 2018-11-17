import Vue from 'vue'
import Basic from './resources/Basic.vue'
import BasicSrc from './resources/BasicSrc.vue'
import clearModule from 'clear-module'
import cache from '../lib/cache'

beforeEach(() => {
  cache.flushAll()
  clearModule.all()
})

test('processes .vue files', () => {
  const vm = new Vue(Basic).$mount()
  vm.toggleClass()
  expect(typeof vm.$el).toBe('object')
})

test('processes .vue files using src attributes', () => {
  const vm = new Vue(BasicSrc).$mount()
  expect(typeof vm.$el).toBe('object')
  vm.toggleClass()
})
