<template>
  <div class="hello">
    <!-- Vue 3.2.13 supports TS in templates -->
    <!-- hence the `!` after `msg` to check if vue-jest supports it as well -->
    <h1 :class="headingClasses">{{ msg! }}</h1>
  </div>
</template>

<style module="css">
.testA {
  background-color: red;
}
</style>
<style module>
.testB {
  background-color: blue;
}
</style>
<style>
.testC {
  background-color: blue;
}
</style>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'basic',
  setup() {
    const msg = 'Welcome to Your Vue.js App'
    const isCrazy = ref(false)
    const headingClasses = computed(() => ({
      red: isCrazy,
      blue: !isCrazy,
      shadow: isCrazy
    }))
    const toggleClass = () => (isCrazy.value = !isCrazy.value)
    return {
      msg,
      isCrazy,
      headingClasses,
      toggleClass
    }
  }
})
</script>
