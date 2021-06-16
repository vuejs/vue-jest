<template>
  <div>
    <div :class="css.a" />
    <div :class="style.b" />
  </div>
</template>

<script>
import { defineComponent, useCssModule } from 'vue'

export default defineComponent({
  setup() {
    const style = useCssModule()
    return {
      style
    }
  }
})
</script>

<style lang="stylus" module="css">
@import './relative/resource';

.a {
  background-color: red;
}
</style>

<style lang="styl" module>
.b {
  background-color: blue;
}
</style>
