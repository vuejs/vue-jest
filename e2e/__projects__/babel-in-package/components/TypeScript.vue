<template>
  <div>
    <div id="parent">
      {{ exclamationMarks }}
    </div>
    <type-script-child />
  </div>
</template>

<script lang="ts">
import TypeScriptChild from './TypeScriptChild.vue'

export default {
  computed: {
    exclamationMarks(): string {
      return 'Parent'
    }
  },
  components: {
    TypeScriptChild
  }
}
</script>
