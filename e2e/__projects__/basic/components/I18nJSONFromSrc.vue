<template>
  <p>{{ $t('hello') }}</p>
</template>

<script>
export default {
  name: 'I18nJSONFromSrc'
}
</script>

<i18n src="./locales.json" />
