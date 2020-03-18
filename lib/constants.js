module.exports = {
  vueOptionsNamespace: '__options__',
  defaultVueJestConfig: {
    transform: {
      i18n: require('./transformers/i18n')
    }
  }
}
