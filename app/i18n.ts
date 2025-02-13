import i18next from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      Home: "Home",
      History: "History",
      Notes: "Notes",
      "Notes History": "Notes History",
      "Bookmarked Notes": "Bookmarked Notes",
      "Expenses Tracker": "Expenses Tracker",
      Settings: "Settings",
      Contact: "Contact",
      "Select Language": "Select Language",
    },
  },
  ru: {
    translation: {
      Home: "Главная",
      History: "История",
      Notes: "Заметки",
      "Notes History": "История заметок",
      "Bookmarked Notes": "Закладки",
      "Expenses Tracker": "Трекер расходов",
      Settings: "Настройки",
      Contact: "Контакт",
      "Select Language": "Выбрать язык",
    },
  },
};

i18next.use(initReactI18next).init({
  resources,
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18next;
