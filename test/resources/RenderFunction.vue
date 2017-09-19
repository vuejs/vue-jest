<script>
  export default {
    name: 'RenderFunction',
    render (createElement) {
      return createElement('section', [this.$slots.default])
    }
  }
</script>
