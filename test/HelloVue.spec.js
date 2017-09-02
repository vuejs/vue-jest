import Vue from 'vue'
import HelloComponent from './resources/Hello.vue'

describe('Test suite for HelloComponent', () => {
  it('Test data msg', () => {
    const ClonedComponent = Vue.extend(HelloComponent)
    const NewComponent = new ClonedComponent({
      data () {
        return {
          msg: 'I am a cool message'
        }
      }
    }).$mount()
    expect(HelloComponent.data().msg).toBe('Welcome to Your Vue.js App')
    expect(NewComponent.msg).toBe('I am a cool message')
    expect(NewComponent.headingClasses).toBeDefined()
    NewComponent.toggleClass()
    expect(NewComponent.isCrazy).toBeTruthy()
  })
})
