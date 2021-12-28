import { MapContainer } from './map/MapContainer';
import { Info } from './info/Info';

import { Nav } from './nav/Nav';
import { RouteSelect } from './route-select/RouteSelect';
import { Settings } from './settings/Settings';
import { StoreProvider } from './store/Store';
import { Stop } from './stop/Stop';

import './App.scss';

export const App = () => {
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
