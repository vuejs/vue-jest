<template>
  <div>
    <div :class="$style.testA"></div>
    <div :class="[ $style.testA ]"></div>
    <div :class="{[$style.testB]: true }"></div>
    <div :class="[$style.testA, { [$style.testB]: true }]"></div>
  </div>
</template>

<style module lang="scss">
  @import "./styles/transitions";

  .testA {
    background-color: red;
  }
  .testB {
    background-color: blue;
  }
</style>

<style module lang="sass">
  $primary-color: #333
</style>
