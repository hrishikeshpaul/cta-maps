import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { Locale } from './i18n/Config';
import { Info } from './info/Info';
import { MapContainer } from './map/MapContainer';
import { Nav } from './nav/Nav';
import { RouteSelect } from './route-select/RouteSelect';
import { Settings } from './settings/Settings';
import { Stop } from './stop/Stop';
import { StoreProvider } from './store/Store';

import './App.scss';
import { LocaleKey } from './store/Store.Types';

export const App = () => {
    const { i18n } = useTranslation();

    useEffect(() => {
        i18n.changeLanguage(localStorage.getItem(LocaleKey) || Locale.EN);
    }, []);

    return (
        <div className="App">
            <StoreProvider>
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
