import axios from 'axios';
import i18n, { InitOptions } from 'i18next';
import HttpApi from 'i18next-http-backend';
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

const initOptions: InitOptions = {
    fallbackLng: Locale.EN,
    lng: Locale.EN,
    ns: ['translations'],
    defaultNS: 'translations',
    react: {
        useSuspense: false,
    },
    backend: {
        allowMultiLoading: true,
        loadPath:
            'https://raw.githubusercontent.com/hrishikeshpaul/cta-maps/main/web-client/src/i18n/locales/{{lng}}.json',
        request: async (options, url, payload, callback) => {
            const { data, status } = await axios.get(url);
            callback(null, { data, status });
        },
        requestOptions: {
            cache: 'default',
        },
    },
};

i18n.use(initReactI18next).use(HttpApi).init(initOptions);

i18n.languages = [Locale.EN, Locale.EN, Locale.CH];

export default i18n;
