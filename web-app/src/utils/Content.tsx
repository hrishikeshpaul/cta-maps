import { FunctionComponent, useEffect } from 'react';

import { Avatar, Box } from '@chakra-ui/react';

import { Favorites } from 'favorites/Favorites';
import { MapContainer } from 'map-container/MapContainer';
import { Nav } from 'nav/Nav';
import { RouteSelect } from 'route-select/RouteSelect';
import { MapLoader } from 'shared/map/Map';
import { Stop } from 'stop/Stop';
import { SocketModule } from './SocketModule';
import { useDataStore } from 'store/data/DataStore';
import { useSystemStore } from 'store/system/SystemStore';

export const AppContent: FunctionComponent = () => {
    const [{ favoriteRoutes }, { setRoute }] = useDataStore();
    const [{ settings }] = useSystemStore();

    useEffect(() => {
        if (settings.showActiveRoutes) {
            Object.values(favoriteRoutes).forEach(({ route, name, color }) => {
                setRoute({ route, name, color });
            });
        }
    }, [settings.showActiveRoutes]); // eslint-disable-line

    return (
        <MapLoader>
            <Box h="100%">
                <SocketModule />
                <MapContainer />
                <Nav />
                <Stop />
                <Favorites />
                <RouteSelect />
                <Avatar src="/logo.svg" size="xs" position="fixed" zIndex={100} bottom="2" right="2" />
            </Box>
        </MapLoader>
    );
};
