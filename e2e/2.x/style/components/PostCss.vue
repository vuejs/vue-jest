<template>
  <section>
    <div :class="$style.a" />
    <div :class="$style.b" />
  </section>
</template>

<style module lang="postcss">
:root {
  --theme_color_background_base: #f00;
}

@define-mixin hover {
  outline: none;
  box-shadow: 0 0 0 2px var(--theme_color_background_base);
}

.a {
  background: color(purple a(90%));
}

.a:hover {
  @mixin hover;
}
</style>

<style module lang="pcss">
.b {
  background: color(red a(90%));
}
</style>
