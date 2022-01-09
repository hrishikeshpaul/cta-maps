import { Box, useColorModeValue } from '@chakra-ui/react';
import { useIdleTimer } from 'react-idle-timer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Favorites } from 'favorites/Favorites';
import { Landing } from 'landing/Landing';
import { MapContainer } from 'map-container/MapContainer';
import { Nav } from 'nav/Nav';
import { RouteSelect } from 'route-select/RouteSelect';
import { Settings } from 'utils/Settings';
import { Stop } from 'stop/Stop';
import { useDataStore } from 'store/data/DataStore';
import { useSystemStore } from 'store/system/SystemStore';
import { FAQ } from 'utils/FAQ';
import { SocketModule } from 'utils/SocketModule';

import './App.scss';

const IDLE_TIME = 1000 * 60 * 3; // 3 minutes
const DEBOUNCE_TIME = 500; // ms

export const App = () => {
    const [, { onIdle, onActive }] = useDataStore();
    const [{ systemLoading }] = useSystemStore();
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
    const color = useColorModeValue('gray.700', 'gray.200');

    return (
        <>
            {systemLoading ? (
                <Landing />
            ) : (
                <Box color={color} h="100%" w="100%">
                    <BrowserRouter>
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <Box h="100%">
                                        <SocketModule />
                                        <MapContainer />
                                        <Nav />
                                        <Stop />
                                        <Favorites />
                                        <RouteSelect />
                                    </Box>
                                }
                            />
                            <Route path="/faq" element={<FAQ />} />
                            <Route path="/settings" element={<Settings />} />
                        </Routes>
                    </BrowserRouter>
                </Box>
            )}
        </>
    );
};
