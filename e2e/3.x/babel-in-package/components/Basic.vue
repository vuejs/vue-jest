<template>
  <div class="hello">
    <h1 :class="headingClasses">{{ msg }}</h1>
  </div>
</template>

<style module="css">
.testA {
  background-color: red;
}
</style>
<style module>
.testB {
  background-color: blue;
}
</style>
<style>
.testC {
  background-color: blue;
}
</style>

<script>
export default {
  name: 'basic',
  computed: {
    headingClasses: function headingClasses() {
      return {
        red: this.isCrazy,
        blue: !this.isCrazy,
        shadow: this.isCrazy
      }
    }
  },
  data: function data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      isCrazy: false
    }
  },
  methods: {
    toggleClass: function toggleClass() {
      this.isCrazy = !this.isCrazy
    }
  }
}
</script>
