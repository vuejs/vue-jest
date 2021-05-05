<template>
  <div class="hello">
    <h1 data-computed>{{ computedMsg }}</h1>
    <h2 data-props>{{ msg }}</h2>
  </div>
</template>

<script lang="ts">
import { Vue, Prop } from 'vue-property-decorator'

export default class ClassComponent extends Vue {
  dataText: string = 'Hello'

  @Prop() msg!: string

  get computedMsg(): string {
    return `Message: ${this.dataText}`
  }
}
</script>
