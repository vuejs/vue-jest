<template>
  <FunctionalSFC :msg="{ id: 1, title: 'foo' }" :onClick="() => {}" />
</template>

<script>
import Vue from 'vue'
import FunctionalSFC from './FunctionalSFC'

export default {
  components: {
    FunctionalSFC
  }
}
</script>
