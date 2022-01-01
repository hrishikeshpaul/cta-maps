import { IdleAlert } from 'idle/Idle';
import { Info } from 'info/Info';
import { Landing } from 'landing/Landing';
import { MapContainer } from 'map/MapContainer';
import { Nav } from 'nav/Nav';
import { RouteSelect } from 'route-select/RouteSelect';
import { Settings } from 'settings/Settings';
import { Stop } from 'stop/Stop';
import { useSystemStore } from 'store/system/SystemStore';
import { SocketModule } from 'utils/SocketModule';

import './App.scss';

export const App = () => {
    const [{ systemLoading }] = useSystemStore();

    return (
        <>
            {systemLoading ? (
                <Landing />
            ) : (
                <div className="App">
                    <SocketModule />
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
