<template>
  <p>{{ $t('hello') }}</p>
</template>

<script>
export default {
  name: 'I18nMergingMultipleBlocks'
}
</script>

<i18n src="./locales.json" />
<i18n>
  {
    "en": {
      "hello": "Hello i18n in SFC!"
    }
  }
</i18n>
<i18n>
  en:
    hello: "hello world!"
  ja:
    hello: "こんにちは、世界！"
</i18n>
