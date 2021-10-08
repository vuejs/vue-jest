<script lang="tsx">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    exclamationMarks(): string {
      return 'tsx components'
    }
  },
  render(): VNode {
    return <div>{this.exclamationMarks}</div>
  }
})
</script>
