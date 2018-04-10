<template>
  <div class="testA"></div>
</template>

<style lang="scss">
  @import "./styles/transitions";
  @import "./styles/direct-imports";
  @import "~__root/test/resources/styles/globals/direct-imports";
  @import "~@design";

  .testA {
    background-color: red;
  }
</style>

<style lang="sass">
  $primary-color: #333
</style>
