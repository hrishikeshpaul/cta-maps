import { FunctionComponent, useEffect } from 'react';

import { Box } from '@chakra-ui/react';

import { MapContainer } from 'map-container/MapContainer';
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
        <Box h="100%">
            <SocketModule />
            <MapContainer />
        </Box>
    );
};
