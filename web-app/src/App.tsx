import { Box, useColorModeValue } from '@chakra-ui/react';
import { useIdleTimer } from 'react-idle-timer';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

import { Landing } from 'utils/Landing';
import { useDataStore } from 'store/data/DataStore';
import { useSystemStore } from 'store/system/SystemStore';
import { AppContent } from 'utils/Content';

import './App.scss';
import { Nav } from 'shared/nav/Nav';
import { Saved } from 'saved/Saved';
import { VehicleDrawer } from 'shared/vehicle/Vehicle';
import { Stop } from 'shared/stop/Stop';
import { MapLoader } from 'shared/map/Map';
import { Search } from 'search/Search';
import { RouteQuery } from 'search/RouteQuery';
import { Settings } from 'settings/Settings';

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
                <Box color={color} h="100%" w="100%" id="main">
                    <MapLoader>
                        <BrowserRouter>
                            <Nav />
                            <VehicleDrawer />
                            <Stop />
                            <Routes>
                                <Route path="/" element={<AppContent />} />
                                <Route path="/search">
                                    <Route index={true} element={<Search />} />
                                    <Route path="query" element={<RouteQuery />} />
                                </Route>
                                <Route path="/saved" element={<Saved />} />
                                <Route path="/settings" element={<Settings />} />
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </BrowserRouter>
                    </MapLoader>
                </Box>
            )}
        </>
    );
};
