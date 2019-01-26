<template>
  <section>
    <div :class="$style.testPcss"></div>
    <div :class="$style.red"></div>
  </section>
</template>

<style lang="postcss">
.testPcss {
  background: color(purple a(90%));
}
</style>

<style module lang="pcss">
.red {
  background: color(red a(90%));
}
</style>
