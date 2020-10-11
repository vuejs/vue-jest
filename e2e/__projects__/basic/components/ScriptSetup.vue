<template>
  <button @click="increase">Count: {{ num }}</button>
  <Basic />
  <span>{{ msg }}</span>
</template>

<script setup="props, { emit }" lang="ts">
export { default as Basic } from './Basic.vue'

import { ref } from 'vue'
export const num = ref(5)
const greet = () => console.log('greet')
export const increase = () => {
  greet()
  num.value++
}
export const msg = 'hello world'
</script>
