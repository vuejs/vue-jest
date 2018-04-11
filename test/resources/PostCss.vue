<template>
  <div class="testPcss"></div>
</template>

<style lang="postcss">
  .testPcss {
    background-color: purple;
  }
</style>

<style lang="pcss">
  /* This syntax is for postcss-custom-properties */
  --primary-color: green;

  /* This syntax is for postcss-nesting, but invalid as Pure CSS */
  body {
    @media screen {
      background-color: grey;
    }
  }
</style>
