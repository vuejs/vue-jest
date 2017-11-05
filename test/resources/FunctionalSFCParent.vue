<template>
    <FunctionalSFC :msg="{id: 1, title: 'foo'}" :onClick="() => {}"/>
</template>

<script>
  import Vue from 'vue'
  import FunctionalSFC from './FunctionalSFC'

  Vue.component('FunctionalSFC', FunctionalSFC)

  export default {
    components: FunctionalSFC
  }
</script>
