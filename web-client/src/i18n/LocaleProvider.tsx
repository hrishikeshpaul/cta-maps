import { FunctionComponent, useEffect } from 'react';

import i18n from 'i18next';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import { LocaleKey } from 'store/data/DataStore.Types';
import { getLocaleJson } from 'store/system/SystemService';
import { useSystemStore } from 'store/system/SystemStore';

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
    const [, { setSystemLoading }] = useSystemStore();

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
                                const { data, status } = await getLocaleJson(url);
                                callback(null, { data, status });
                                setSystemLoading(false);
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
    }, []); // eslint-disable-line

    return <></>;
};
