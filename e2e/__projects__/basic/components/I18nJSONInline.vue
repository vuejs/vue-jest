<template>
  <p>{{ $t('hello') }}</p>
</template>

<script>
export default {
  name: 'I18nJSONInline'
}
</script>

<i18n>
  {
    "en": {
      "hello": "Hello i18n in SFC!"
    }
  }
</i18n>
