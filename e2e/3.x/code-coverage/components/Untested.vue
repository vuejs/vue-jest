<template>
  <div class="hello">
    <h1 :class="headingClasses">
      {{ message }}
    </h1>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const message = 'Hello World'
let isCrazy = false

const headingClasses = computed(() => {
  return {
    red: isCrazy,
    blue: !isCrazy,
    shadow: isCrazy
  }
})

const toggleClass = () => {
  isCrazy = !isCrazy
}
</script>
