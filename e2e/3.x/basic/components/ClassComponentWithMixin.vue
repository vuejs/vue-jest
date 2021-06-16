<template>
  <div class="hello">
    <h1 data-mixin>{{ message }}</h1>
  </div>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import ClassMixin from './ClassMixin'

export default class ClassComponent extends mixins(ClassMixin) {}
</script>
