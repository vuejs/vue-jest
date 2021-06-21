<template>
  <div id="child">{{ exclamationMarks }}</div>
</template>

<script lang="ts">
export default {
  computed: {
    exclamationMarks(): string {
      return 'Child'
    }
  }
}
</script>
