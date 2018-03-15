<template>
  <div :class="$style.testA"></div>
</template>

<style module lang="scss">
  @import "./styles/transitions";

  .testA {
    background-color: red;
  }
</style>

<style module lang="sass">
  $primary-color: #333
</style>
