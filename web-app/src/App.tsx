import { Box, useColorModeValue } from '@chakra-ui/react';
import { useIdleTimer } from 'react-idle-timer';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

import { Landing } from 'utils/Landing';
import { useDataStore } from 'store/data/DataStore';
import { useSystemStore } from 'store/system/SystemStore';
import { MapRender } from 'screens/map-render/MapView';

import './App.scss';
import { Nav } from 'shared/nav/Nav';
import { Saved } from 'screens/saved/Saved';
import { VehicleDrawer } from 'shared/vehicle/Vehicle';
import { Stop } from 'shared/stop/Stop';
import { MapLoader } from 'shared/map/Map';
import { Search } from 'screens/search/Search';
import { Settings } from 'screens/settings/Settings';
import { SocketModule } from 'utils/SocketModule';
import { ScrollTop } from 'utils/ScrollTop';

const IDLE_TIME = 1000 * 60 * 3; // 3 minutes
const DEBOUNCE_TIME = 500; // ms

export const App = () => {
    const [, { onIdle, onActive }] = useDataStore();
    const [{ systemLoading }] = useSystemStore();
    const color = useColorModeValue('gray.700', 'gray.200');
    const { reset } = useIdleTimer({
        timeout: IDLE_TIME,
        onIdle: () => {
            onIdle();
        },
        onActive: () => {
            onActive();
        },
        onAction: () => {
            reset();
        },
        debounce: DEBOUNCE_TIME,
    });

    return (
        <>
            {systemLoading ? (
                <Landing />
            ) : (
                <Box color={color} h="100%" w="100%" id="main">
                    <MapLoader>
                        <BrowserRouter>
                            <Nav />
                            <Stop />
                            <SocketModule />
                            <VehicleDrawer />
                            <ScrollTop />
                            <Routes>
                                <Route path="/" element={<MapRender />} />
                                <Route path="/search/*" element={<Search />} />
                                <Route path="/saved" element={<Saved />} />
                                <Route path="/settings/*" element={<Settings />} />
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </BrowserRouter>
                    </MapLoader>
                </Box>
            )}
        </>
    );
};
