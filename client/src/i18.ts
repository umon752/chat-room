import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 直接引入語系檔案
import en from './locales/en/translation.json';
import zh from './locales/zh/translation.json';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh'],
    resources: {
      en: { translation: en },
      'zh': { translation: zh },
    },
    // debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
