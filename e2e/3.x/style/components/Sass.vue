<template>
  <div>
    <div :class="$style.a"></div>
    <div :class="style.b"></div>
    <div :class="$style.c"></div>
    <div :class="style.d"></div>
    <div :class="$style.e"></div>
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

<style module lang="sass">
@import "~__styles/sass-a"

.c
  background-color: red
</style>

<style lang="sass">
.d
  background-color: blue
</style>

<style lang="sass" module themed>
.e
  background-color: blue
</style>
