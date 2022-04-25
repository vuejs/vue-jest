<template>
  <section>
    <div :class="$style.c" />
    <div :class="style.d" />
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
:root {
  --theme_color_background_base: #f00;
}

@define-mixin hover {
  outline: none;
  box-shadow: 0 0 0 2px var(--theme_color_background_base);
}

.c {
  background: color(purple a(90%));
}

.c:hover {
  @mixin hover;
}
</style>

<style module lang="pcss">
.d {
  background: color(red a(90%));
}
</style>
