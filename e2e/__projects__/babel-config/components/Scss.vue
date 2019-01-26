<template>
  <div class="testA">
    <span :class="this.$style.g"></span>
    <span :class="this.$style.dark.f"></span>
  </div>
</template>

<style module lang="scss">
@import '~__styles/scss-a';

.c {
  background-color: red;
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
