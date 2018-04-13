<template>
  <div>
    <div :class="$style.testA"></div>
    <div :class="[ $style.testA ]"></div>
    <div :class="{[$style.testB]: true }"></div>
    <div :class="[$style.testA, { [$style.testB]: true }]"></div>
    <div :class="$style.thisIsAGlobalClass"></div>
  </div>
</template>

<style module lang="sass">
  @import "./styles/sass/direct-imports"
  @import "~__root/test/resources/styles/sass/direct-imports-moduleNameMapper"
  @import "~__test/resources/styles/sass/direct-imports-multiple-moduleNameMapper"

  .testA
    background-color: red
  .testB
    background-color: blue
</style>

<style module lang="sass">
  @import "./styles/sass/direct-imports-second"
</style>
