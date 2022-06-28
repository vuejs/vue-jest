<template>
  <div>
    <h1 class="entry">Entry</h1>
    <lib-component />
  </div>
</template>

<script>
import LibComponent from 'vue2-sass-importer-lib/index.vue'

export default {
  components: {
    LibComponent
  }
}
</script>

<style lang="scss" module>
@import '~vue2-sass-importer-sass-lib/index.scss';

.entry {
  @include my-v2-mixin;
}
</style>
