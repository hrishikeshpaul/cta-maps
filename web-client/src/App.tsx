import { IdleAlert } from './idle/Idle';
import { Info } from './info/Info';
import { Landing } from './landing/Landing';
import { MapContainer } from './map/MapContainer';
import { Nav } from './nav/Nav';
import { RouteSelect } from './route-select/RouteSelect';
import { Settings } from './settings/Settings';
import { Stop } from './stop/Stop';
import { useDataStore } from './store/data/DataStore';

import './App.scss';
import { useSystemStore } from 'store/system/SystemStore';

export const App = () => {
    const [{ systemLoading }] = useSystemStore();

    return (
        <>
            {systemLoading ? (
                <Landing />
            ) : (
                <div className="App">
                    <IdleAlert />
                    <Nav />
                    <RouteSelect />
                    <Info />
                    <Stop />
                    <Settings />
                    <MapContainer />
                </div>
            )}
        </>
    );
};
