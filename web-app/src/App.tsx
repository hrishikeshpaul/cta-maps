import { useEffect } from 'react';

import { Avatar, Box, useColorModeValue } from '@chakra-ui/react';
import { useIdleTimer } from 'react-idle-timer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Favorites } from 'favorites/Favorites';
import { Landing } from 'landing/Landing';
import { MapContainer } from 'map-container/MapContainer';
import { Nav } from 'nav/Nav';
import { MapLoader } from 'shared/map/Map';
import { Stop } from 'stop/Stop';
import { useDataStore } from 'store/data/DataStore';
import { useSystemStore } from 'store/system/SystemStore';
import { RouteSelect } from 'route-select/RouteSelect';
import { FAQ } from 'utils/FAQ';
import { Settings } from 'utils/Settings';
import { SocketModule } from 'utils/SocketModule';

import './App.scss';

const IDLE_TIME = 1000 * 60 * 3; // 3 minutes
const DEBOUNCE_TIME = 500; // ms

export const App = () => {
    const [{ favoriteRoutes }, { onIdle, onActive, setRoute }] = useDataStore();
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

    useEffect(() => {
        Object.values(favoriteRoutes).forEach(({ route, name, color }) => {
            setRoute({ route, name, color });
        });
    }, []); // eslint-disable-line

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
                                    <MapLoader>
                                        <Box h="100%">
                                            <SocketModule />
                                            <MapContainer />
                                            <Nav />
                                            <Stop />
                                            <Favorites />
                                            <RouteSelect />
                                            <Avatar
                                                src="/logo.svg"
                                                size="xs"
                                                position="fixed"
                                                zIndex={100}
                                                bottom="2"
                                                right="2"
                                            />
                                        </Box>
                                    </MapLoader>
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
