import { useIdleTimer } from 'react-idle-timer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Landing } from 'landing/Landing';
import { MapContainer } from 'map/MapContainer';
import { Nav } from 'nav/Nav';
import { RouteSelect } from 'route-select/RouteSelect';
import { Settings } from 'utils/Settings';
import { Stop } from 'stop/Stop';
import { useDataStore } from 'store/data/DataStore';
import { useSystemStore } from 'store/system/SystemStore';
import { FAQ } from 'utils/FAQ';
import { SocketModule } from 'utils/SocketModule';

import './App.scss';
import { Container } from '@chakra-ui/react';

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

    return (
        <>
            {systemLoading ? (
                <Landing />
            ) : (
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <div className="App">
                                    <Container
                                        maxW="container.lg"
                                        p="0"
                                        position="fixed"
                                        top="0"
                                        left="50%"
                                        transform="translate(-50%)"
                                        zIndex={100}
                                    >
                                        <Nav />
                                    </Container>
                                    <SocketModule />
                                    <RouteSelect />
                                    <Stop />
                                    <MapContainer />
                                </div>
                            }
                        />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </BrowserRouter>
            )}
        </>
    );
};
