import { shallow } from 'vue-test-utils'
import Coffee from './resources/Coffee.vue'
import CoffeeScript from './resources/CoffeeScript.vue'

test('processes .vue file with lang set to coffeescript', () => {
  shallow(Coffee)
})

test('processes .vue file with lang set to coffeescript', () => {
  shallow(CoffeeScript)
})
