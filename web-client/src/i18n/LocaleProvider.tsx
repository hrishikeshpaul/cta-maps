import { FunctionComponent, useEffect } from 'react';

import i18n from 'i18next';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import { getLocaleJson } from '../store/Service';
import { useStore } from '../store/Store';
import { LocaleKey } from '../store/Store.Types';

export enum Locale {
    EN = 'en',
    ES = 'es',
    ZH = 'zh',
}

export const LocaleLabels = {
    [Locale.EN]: 'ENGLISH',
    [Locale.ES]: 'ESPANOL',
    [Locale.ZH]: 'CHINESE',
};

export const LocaleProvider: FunctionComponent = () => {
    const [, { setSystemLoading }] = useStore();

    useEffect(() => {
        i18n.languages = [Locale.EN, Locale.EN, Locale.ZH];

        i18n.use(initReactI18next)
            .use(HttpApi)
            .init(
                {
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
                                setTimeout(async () => {
                                    const { data, status } = await getLocaleJson(url);
                                    callback(null, { data, status });
                                    setSystemLoading(false);
                                }, 2000);
                            } catch (err: any) {
                                console.log(err);
                            }
                        },
                        requestOptions: {
                            cache: 'default',
                        },
                    },
                },
                () => {
                    i18n.changeLanguage(localStorage.getItem(LocaleKey) || Locale.EN);
                },
            );
    }, []);

    return <></>;
};
