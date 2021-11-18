<template>
  <h1>{{ name }}</h1>
</template>

<script setup lang="ts">
const { name = 'name' } = defineProps<{ name?: string }>()
</script>
