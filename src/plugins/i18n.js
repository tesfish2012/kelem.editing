// i18n.js
import { createI18n } from 'vue-i18n'
import enMessages from '@/locales/en.json'
import tigMessages from '@/locales/tig.json'
const i18n = createI18n({
  legacy: false, // when  using Vue 3 with Composition API
  locale: localStorage.getItem('lang') || 'en', // default locale
  fallbackLocale: 'en', // fallback locale
  messages: {
    en: enMessages,
    ትግርኛ: tigMessages
  }
})

export default i18n
