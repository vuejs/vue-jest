<template>
  <div />
</template>

<style lang="scss" module>
@import '~__styles/scss-a';
// Import absolute URL via moduleNameMapper.
@import '~tmp/absolute';
// Import _partial from within node_modules.
@import '~vue-jest-test/partial';
@import '~vue-jest-test/foo.bar'; // Import false extension.
@import '~vue-jest-test/baz'; // Import .css from within .scss.
@import '~vue-jest-test/qux'; // Import .sass from within .scss.

.c {
  background-color: $primary-color;
}
</style>

<style lang="scss">
.d {
  background-color: red;
}
</style>

<style lang="scss" module themed>
.f {
  background-color: red;
}
</style>
