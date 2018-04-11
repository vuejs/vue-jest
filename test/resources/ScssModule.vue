<template>
  <div>
    <div :class="$style.testA"></div>
    <div :class="[ $style.testA ]"></div>
    <div :class="{[$style.testB]: true }"></div>
    <div :class="[$style.testA, { [$style.testB]: true }]"></div>
    <div :class="$style.thisIsAGlobalClass"></div>
  </div>
</template>

<style module lang="scss">
  @import "./styles/scss/direct-imports";
  @import "~__root/test/resources/styles/scss/direct-imports-moduleNameMapper";
  @import "~__test/resources/styles/scss/direct-imports-multiple-moduleNameMapper";

  .testA {
    background-color: red;
  }
  .testB {
    background-color: blue;
  }
</style>

<style module lang="scss">
  @import "./styles/scss/direct-imports-second";
</style>
