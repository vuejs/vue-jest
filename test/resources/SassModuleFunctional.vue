<template functional>
  <div>
    <div :class="$style.testAFunctional"></div>
    <div :class="[ $style.testAFunctional ]"></div>
    <div :class="{[$style.testBFunctional]: true }"></div>
    <div :class="[$style.testAFunctional, { [$style.testBFunctional]: true }]"></div>
    <div :class="[$otherStyle.otherTestAFunctional, { [$otherStyle.otherTestBFunctional]: true }]"></div>
  </div>
</template>

<style module lang="sass">
  .testAFunctional
    background-color: red
  .testBFunctional
    background-color: blue
</style>

<style module="$otherStyle" lang="scss">
  .otherTestAFunctional {
    background-color: red;
  }
  .otherTestBFunctional {
    background-color: blue;
  }
</style>