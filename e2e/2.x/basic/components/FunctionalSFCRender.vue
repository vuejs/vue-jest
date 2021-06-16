<script>
export default {
  name: 'FunctionalSFCRender',
  functional: true,
  render(createElement, { $style }) {
    return createElement('div', {
      class: [$style.ModuleClass]
    })
  }
}
</script>

<style lang="scss" module>
.ModuleClass {
  width: auto;
}
</style>
