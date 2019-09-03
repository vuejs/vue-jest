import { shallowMount } from '@vue/test-utils'
import PostCss from './resources/PostCss.vue'
import PostCssModule from './resources/PostCssModule.vue'

describe('processes .vue file with PostCSS style', () => {
  const wrapper = shallowMount(PostCss)

  it('does stick classes to component', () => {
    expect(wrapper.classes()).toContain('testPcss')
  })

  it('does stick next classes to component', () => {
    expect(wrapper.find('span').classes()).toContain('nestedCom')
  })

  const wrapperModules = shallowMount(PostCssModule)

  const classListModules = Object.keys(wrapperModules.vm.$style)

  it('does inject classes to $style', () => {
    expect(classListModules).toContain('testPcss')
  })

  it('does inject nested classes to $style', () => {
    expect(classListModules).toContain('nestedClass')
  })
})
