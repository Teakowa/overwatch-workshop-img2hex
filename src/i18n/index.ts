import { createI18n } from 'vue-i18n'
import en from './locales/en'
import zhCN from './locales/zh-CN'

const messages = {
  en,
  'zh-CN': zhCN,
}

export const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'en',
  messages,
})

export const availableLocales = [
  {
    code: 'zh-CN',
    name: '简体中文',
  },
  {
    code: 'en',
    name: 'English',
  },
] 