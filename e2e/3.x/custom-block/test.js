import Basic from './components/Basic.vue'
import Multiple from './components/Multiple.vue'

test('Basic', () => {
  expect(Basic.__custom).toMatchObject([
    {
      en: {
        hello: 'Hello!'
      },
      ja: {
        hello: 'こんにちは！'
      }
    }
  ])
  expect(Basic.__custom).toMatchSnapshot()
})

test('Multiple blocks', () => {
  expect(Multiple.__custom).toMatchObject([
    {
      en: {
        hello: 'Hello!'
      },
      ja: {
        hello: 'こんにちは！'
      }
    },
    {
      foo: 'foo'
    }
  ])
  expect(Multiple.__custom).toMatchSnapshot()
})
