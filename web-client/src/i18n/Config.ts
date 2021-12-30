import i18n, { InitOptions } from 'i18next';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import { getLocaleJson } from '../store/Service';

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
        loadPath: '/locale/{{lng}}',
        request: async (_, url, __, callback) => {
            try {
                const { data, status } = await getLocaleJson(url);
                callback(null, { data, status });
            } catch (err: any) {
                console.log(err.response);
            }
        },
        requestOptions: {
            cache: 'default',
        },
    },
};

i18n.use(initReactI18next).use(HttpApi).init(initOptions);

i18n.languages = [Locale.EN, Locale.EN, Locale.CH];

export default i18n;
