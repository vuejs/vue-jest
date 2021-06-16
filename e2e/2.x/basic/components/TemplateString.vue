<template>
  <div
    :data-sth="
      gql`
        query {
          id
        }
      `
    "
  />
</template>

<script lang="ts">
export default {
  methods: {
    gql([str]) {
      return str
    }
  }
}
</script>
