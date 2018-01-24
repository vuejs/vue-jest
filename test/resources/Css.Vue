<template>
  <div :class="[css.testA, $style.testB]"></div>
</template>

<script>
export default {
  name: 'Button',
}
</script>

<style module="css">
  .testA {
    background-color: red;
  }
</style>
<style>
  .testB {
    background-color: blue;
  }
</style>
