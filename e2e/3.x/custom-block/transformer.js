module.exports = {
  process({ blocks, vueOptionsNamespace, filename, config }) {
    console.log('custom block transformer', blocks, '---', config)
    return ''
  }
}
