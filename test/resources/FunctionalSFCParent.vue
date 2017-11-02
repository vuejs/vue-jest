<template>
    <FunctionalSFC msg="TEST"/>
</template>

<script>
  import Vue from 'vue'
  import FunctionalSFC from './FunctionalSFC'

  Vue.component('FunctionalSFC', FunctionalSFC)

  export default {
    components: FunctionalSFC
  }
</script>
