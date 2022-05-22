<template>
  <div>
    <div :class="$style.a">a</div>
    <div :class="$style.b">b</div>
    <div :class="$style.c">c</div>
    <div :class="$style.d">d</div>
  </div>
</template>

<style module lang="less">
@import './styles/less-a.less';
.a {
  background-color: @primary-color;
}
.b {
  color: @primary-color;
}
</style>
