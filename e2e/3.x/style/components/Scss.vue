<template>
  <div>
    <div :class="$style.a" />
    <div :class="style.b" />
    <div :class="$style.c" />
    <div :class="style.d" />
    <div :class="$style.e" />
    <div :class="style.f" />
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

<style lang="scss" module>
@import '~__styles/scss-a';

.c {
  background-color: $primary-color;
}
</style>

<style lang="scss">
.d {
  background-color: red;
}
</style>

<style lang="scss" module themed>
.f {
  background-color: red;
}
</style>
