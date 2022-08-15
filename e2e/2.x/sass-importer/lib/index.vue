<template>
  <div class="lib-class">Lib Component</div>
</template>

<style lang="scss" module>
@import '~vue2-sass-importer-sass-lib/index.scss';

.lib-class {
  @include my-v1-mixin;
}
</style>
