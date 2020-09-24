<template>
  <div :class="$style.testClass">
    <div class="a" />
  </div>
</template>

<style module src="./styles/external.css" />

<style module="$style2" src="~__styles/external.css" />

<style module="$style3" src="./styles/external.css"></style>

<style module="css">
.a {
  background: color(red a(90%));
}
</style>
