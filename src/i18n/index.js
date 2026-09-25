import { createI18n } from 'vue-i18n';
import id from './locales/id.json';
import en from './locales/en.json';

const messages = {
  id,
  en
};

const savedLocale = localStorage.getItem('user_locale') || 'id';

const i18n = createI18n({
  legacy: false, // You must set `false`, to use Composition API
  locale: savedLocale,
  fallbackLocale: 'id',
  messages,
});

export default i18n;
