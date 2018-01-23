<template>
  <div :class="[css.testA, $style.testB]"></div>
</template>

<script>
export default {
  name: 'Button',
}
</script>

<style lang="stylus" module="css">
  .testA {
    background-color: red;
  }
</style>
<style lang="styl">
  .testB {
    background-color: blue;
  }
</style>
