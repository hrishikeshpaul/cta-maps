import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { IdleAlert } from './idle/Idle';
import { Info } from './info/Info';
import { MapContainer } from './map/MapContainer';
import { Nav } from './nav/Nav';
import { RouteSelect } from './route-select/RouteSelect';
import { Settings } from './settings/Settings';
import { Stop } from './stop/Stop';
import { StoreProvider } from './store/Store';
import { LocaleKey } from './store/Store.Types';

import './App.scss';
import { LocaleProvider, Locale } from './i18n/LocaleProvider';

export const App = () => {
    const { i18n } = useTranslation();

    useEffect(() => {
        i18n.changeLanguage(localStorage.getItem(LocaleKey) || Locale.EN);
    }, [i18n]);

    return (
        <div className="App">
            <StoreProvider>
                <LocaleProvider />
                <IdleAlert />
                <Nav />
                <RouteSelect />
                <Info />
                <Stop />
                <Settings />
                <MapContainer />
            </StoreProvider>
        </div>
    );
};
