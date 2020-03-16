<template functional>
  <div @click="props.onClick(props.msg.id)">
    {{ props.msg.title }} <slot></slot>
  </div>
</template>

<script>
export default {
  setup(p, c) {
    console.log(p, c)
  }
}
</script>
