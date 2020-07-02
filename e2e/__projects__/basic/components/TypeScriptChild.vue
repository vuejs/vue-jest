<template>
  <div id="child">{{ exclamationMarks }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  computed: {
    exclamationMarks(): string {
      return 'Child'
    }
  }
})
</script>
