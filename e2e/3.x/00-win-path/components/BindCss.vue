<template>
  <div class="testA">
    {{ sizeA }}
  </div>
  <div class="testB">
    {{ sizeB }}
  </div>
  <div class="testC">
    {{ sizeC.val }}
  </div>
</template>

<style scoped>
.testA {
  background-color: red;
  width: v-bind('sizeA');
  height: v-bind('sizeA');
}
</style>
<style module>
.testB {
  background-color: blue;
  width: v-bind('sizeB');
  height: v-bind('sizeB');
}
</style>
<style>
.testC {
  background-color: blue;
  width: v-bind('sizeC.val');
  height: v-bind('sizeC.val');
}
</style>

<script setup>
import { ref } from 'vue'

const sizeA = ref('100px')
const sizeB = '100px'
const sizeC = {
  val: '100px'
}
</script>
