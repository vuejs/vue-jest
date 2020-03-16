<script>
import { h } from 'vue'

export default {
  name: 'RenderFunction',
  render() {
    return h('section', this.$slots.default())
  }
}
</script>
