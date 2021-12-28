import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export enum Locale {
    EN = 'en',
    ES = 'es',
    CH = 'ch',
}

export const LocaleLabels = {
    [Locale.EN]: 'ENGLISH',
    [Locale.ES]: 'ESPANOL',
    [Locale.CH]: 'CHINESE',
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
        [Locale.CH]: {
            translations: require('./locales/ch_CH.json'),
        },
    },
    ns: ['translations'],
    defaultNS: 'translations',
});

i18n.languages = [Locale.EN, Locale.EN, Locale.CH];

export default i18n;
