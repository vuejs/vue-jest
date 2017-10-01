<template>
    <div><basic /></div>
</template>

<script lang="ts">
import Basic from './Basic'

export default {
    computed: {
        exclamationMarks(): string {
            return  'string'
        }
    },
    components: {
      Basic
    }
};
</script>
