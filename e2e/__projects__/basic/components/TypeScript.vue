<template>
  <div>
    <div id="parent">
      {{ exclamationMarks }}
    </div>
    <type-script-child />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TypeScriptChild from './TypeScriptChild.vue'
export default defineComponent({
  computed: {
    exclamationMarks(): string {
      return 'Parent'
    }
  },
  components: {
    TypeScriptChild
  }
})
</script>
