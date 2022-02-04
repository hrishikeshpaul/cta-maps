import { FunctionComponent, useEffect, useState } from 'react';

import { Box, Spinner, Center, Accordion } from '@chakra-ui/react';

import { RouteOption, RouteExtended } from 'screens/search/route-select/RouteOption';
import { useDataStore } from 'store/data/DataStore';
import { useSystemStore } from 'store/system/SystemStore';
import { RouteType } from 'store/data/DataStore.Types';

interface Props {
    routes: RouteExtended[];
    onChange?: (idx: number[]) => void;
    expandedPanelIdx?: number[];
    type?: RouteType;
}

export const RouteSelect: FunctionComponent<Props> = ({ routes: routesAsProps, onChange, expandedPanelIdx, type }) => {
    const [{ routes: currentRoutes }] = useDataStore();
    const [{ routesLoading }] = useSystemStore();
    const [routes, setRoutes] = useState<RouteExtended[]>(routesAsProps);

    useEffect(() => {
        setRoutes(routesAsProps);
    }, [routesAsProps]);

    useEffect(() => {
        if (Object.keys(currentRoutes).length === 0) {
            setRoutes((prevRoutes) => {
                const updatedRoutes: RouteExtended[] = [...prevRoutes];

                prevRoutes.forEach((route) => {
                    route.selected = false;
                });

                return updatedRoutes;
            });
        }
    }, [currentRoutes]);

    return (
        <>
            <Box pb="4">
                <Accordion index={expandedPanelIdx} allowMultiple w="100%" onChange={onChange}>
                    {routes.map((route) => (
                        <Box key={route.route}>
                            {type ? (
                                type === route.type && (
                                    <RouteOption onChange={setRoutes} routes={routes} currentRoute={route} />
                                )
                            ) : (
                                <RouteOption onChange={setRoutes} routes={routes} currentRoute={route} />
                            )}
                        </Box>
                    ))}
                </Accordion>

                {routesLoading ? (
                    <Center>
                        <Spinner color="blue.500" />
                    </Center>
                ) : null}
            </Box>
        </>
    );
};
