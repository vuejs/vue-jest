<template>
  <section>
    <div :class="$style.a"></div>
    <div :class="$style.b"></div>
  </section>
</template>

<style module lang="postcss">
.a {
  background: color(purple a(90%));
}
</style>

<style module lang="pcss">
.b {
  background: color(red a(90%));
}
</style>
