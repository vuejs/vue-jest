<template>
  <section>
    <div :class="$style.c"></div>
    <div :class="style.d"></div>
  </section>
</template>

<script>
import { useCssModule, defineComponent } from 'vue'
export default defineComponent({
  setup() {
    const style = useCssModule()
    return {
      style
    }
  }
})
</script>

<style module lang="postcss">
.c {
  background: color(purple a(90%));
}
</style>

<style module lang="pcss">
.d {
  background: color(red a(90%));
}
</style>
