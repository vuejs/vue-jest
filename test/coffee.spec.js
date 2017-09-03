import { shallow } from 'vue-test-utils'
import Coffee from './resources/Coffee.vue'

test('processes .vue file with coffee script', () => {
  shallow(Coffee)
})
