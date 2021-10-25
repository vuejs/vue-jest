<template>
  <button @click="increase">Count: {{ num }}</button>
  <Basic />
  <span>{{ msg! }}</span>
</template>

<script setup lang="ts">
import Basic from './Basic.vue'
import { ref } from 'vue'

const num = ref(5)
const greet = () => console.log('greet')
const increase = () => {
  greet()
  num.value++
}
const msg = 'hello world'
</script>
