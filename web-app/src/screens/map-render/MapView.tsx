import { FunctionComponent, useEffect } from 'react';

import { Box } from '@chakra-ui/react';

import { MapContainer } from 'screens/map-render/map-container/MapContainer';
import { useDataStore } from 'store/data/DataStore';
import { useSystemStore } from 'store/system/SystemStore';

export const MapRender: FunctionComponent = () => {
    const [{ favoriteRoutes }, { setRoute }] = useDataStore();
    const [{ settings }] = useSystemStore();

    useEffect(() => {
        if (settings.showActiveRoutes) {
            Object.values(favoriteRoutes).forEach((route) => {
                setRoute(route);
            });
        }
    }, [settings.showActiveRoutes]); // eslint-disable-line

    return (
        <Box h="100%" position="relative">
            <MapContainer />
        </Box>
    );
};
