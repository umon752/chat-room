import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const useLanguage = () => {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language); // 記錄當前語言

  const changeLang = (lng: string) => {
    i18n.changeLanguage(lng); // 切換語言
    setLang(lng); // 更新本地狀態
  };

  return { t, lang, changeLang };
};

export default useLanguage;
