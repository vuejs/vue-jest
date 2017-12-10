import { shallow } from 'vue-test-utils'
import Coffee from './resources/Coffee.vue'
import CoffeeScript from './resources/CoffeeScript.vue'
import CoffeeES6 from './resources/CoffeeES6.vue'
import CoffeeScriptES6 from './resources/CoffeeScriptES6.vue'

test('processes .vue file with lang set to coffeescript', () => {
  shallow(Coffee)
})

test('processes .vue file with lang set to coffeescript', () => {
  shallow(CoffeeScript)
})

test('processes .vue file with lang set to coffeescript', () => {
  shallow(CoffeeES6)
})

test('processes .vue file with lang set to coffeescript', () => {
  shallow(CoffeeScriptES6)
})
