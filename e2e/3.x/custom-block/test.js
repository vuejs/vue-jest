import { createApp, h } from 'vue'

import Basic from './components/Basic.vue'

function mount(Component, props, slots) {
  document.getElementsByTagName('html')[0].innerHTML = ''
  const el = document.createElement('div')
  el.id = 'app'
  document.body.appendChild(el)
  const Parent = {
    render() {
      return h(Component, props, slots)
    }
  }
  return createApp(Parent).mount(el)
}

test('custom block transformer', () => {
  // const filePath = resolve(__dirname, './components/I18n.vue')
  // const fileString = readFileSync(filePath, { encoding: 'utf8' })

  // const { code } = jestVue.process(fileString, filePath, {
  //   moduleFileExtensions: ['js', 'vue'],
  //   transform: {
  //     "^.+\\.js$": "babel-jest",
  //     "^.+\\.vue$": "vue3-jest"
  //   },
  // })

  // expect(code).toMatchSnapshot()
  console.log('basic', Basic)
  // const wrapper = mount(I18n)
  // console.log(wrapper)
})
