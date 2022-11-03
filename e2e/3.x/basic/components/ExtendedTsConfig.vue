<template>
  <div>
    {{ exclamationMarks }}
    <type-script-child />
  </div>
</template>

<script lang="ts">
import TypeScriptChild from './TypeScriptChild.vue'

import moduleRequiringEsModuleInterop from './ModuleRequiringEsModuleInterop'

// The default import above relies on esModuleInterop being set to true in order to use it from
// an import statement instead of require. This option is configured in the tsconfig.base.json,
// so if we are no longer fully processing the tsconfig options (extended from a base config)
// this test should fail. This was one of the only reliable ways I could get a test to fail if
// these conditions are not being met and happen to be the use-case which was triggering errors
// in my config setup.

if (moduleRequiringEsModuleInterop()) {
  throw new Error('Should never hit this')
}

export default {
  computed: {
    exclamationMarks(): string {
      return 'string'
    }
  },
  components: {
    TypeScriptChild
  }
}
</script>
