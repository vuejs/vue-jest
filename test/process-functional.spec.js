import extractProps from '../lib/process-functional'

describe('when extracting props with props. prefix from functional template content', () => {

  it('extracts interpolated props ', () => {
    const content = '<div> {{props.msg1 }} {{props.msg2}}</div>'

    expect(extractProps(content)).toBe("[ 'msg1', 'msg2' ]")
  })

  it('extracts props used in v-for', () => {
    const content = '<div v-for="bar in props.foo.bar"> {{ bar }}} </div>'

    expect(extractProps(content)).toBe("[ 'foo' ]")
  })
})
