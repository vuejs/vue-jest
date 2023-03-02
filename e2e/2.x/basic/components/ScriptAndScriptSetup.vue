<template>
  <div>
    <button @click="increase">Products: {{ products }}</button>
    <Basic />
    <span>{{ msg }}</span>
  </div>
</template>

<script>
import Basic from './Basic.vue'
</script>

<script setup>
import { ref } from 'vue'

const products = ref(10)
const greet = () => console.log('greet')
const increase = () => {
  greet()
  num.value++
}
const msg = 'hello world'
</script>
