import extractProps from '../lib/extract-props'

describe('when extracting props with props. prefix from functional template content', () => {
  it('extracts interpolated props ', () => {
    const content = '<div> {{props.msg1 }} {{props.msg2}}</div>'

    expect(extractProps(content)).toBe("[ 'msg1', 'msg2' ]")
  })

  it('extracts props used in v-for', () => {
    const content = '<div v-for="bar in props.foo.bar"> {{ bar }}} </div>'

    expect(extractProps(content)).toBe("[ 'foo' ]")
  })

  it('extracts props with nested structure', () => {
    const content = '<div> {{props.msg1.foo }} {{props.msg1.bar}}</div>'

    expect(extractProps(content)).toBe("[ 'msg1' ]")
  })

  it('extracts callback props', () => {
    const content = '<button @click="props.onClick(props.msg)">{{props.msg.title}}</button>'
    expect(extractProps(content)).toBe("[ 'onClick', 'msg' ]")
  })

  it('extracts array props', () => {
    const content = '<div>{{props.msg[title]}}</div>'
    expect(extractProps(content)).toBe("[ 'msg' ]")
  })
})
