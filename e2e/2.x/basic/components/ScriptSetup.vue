<template>
  <div>
    <button @click="increase">Count: {{ num }}</button>
    <Basic />
    <span>{{ msg }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Basic from './Basic.vue'

const num = ref(5)
const greet = () => console.log('greet')
const increase = () => {
  greet()
  num.value++
}
const msg = 'hello world'
</script>
