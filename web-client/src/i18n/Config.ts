import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export enum Locale {
    EN = 'en',
    ES = 'es',
}

export const LocaleLabels = {
    [Locale.EN]: 'English',
    [Locale.ES]: 'Espanol',
};

i18n.use(initReactI18next).init({
    fallbackLng: Locale.EN,
    lng: Locale.EN,
    resources: {
        [Locale.EN]: {
            translations: require('./locales/en_US.json'),
        },
        [Locale.ES]: {
            translations: require('./locales/es_ES.json'),
        },
    },
    ns: ['translations'],
    defaultNS: 'translations',
});

i18n.languages = [Locale.EN, Locale.EN];

export default i18n;
