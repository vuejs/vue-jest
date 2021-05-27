<template>
  <div>
    <div :class="$style.a">a</div>
    <div :class="styles.b">b</div>
  </div>
</template>

<script>
import { useCssModule, defineComponent } from 'vue'
export default defineComponent({
  setup() {
    const styles = useCssModule()

    return {
      styles
    }
  }
})
</script>

<style module lang="less">
.a {
  background-color: @primary-color;
}
.b {
  color: @primary-color;
}
</style>
