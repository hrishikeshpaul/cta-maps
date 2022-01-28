import { FunctionComponent, useEffect, useState, UIEvent } from 'react';

import { Box, Spinner, Center } from '@chakra-ui/react';

import { Inspector } from 'inspector/Inspector';
import { RouteOption, RouteExtended } from 'search/RouteOption';
import { useDataStore } from 'store/data/DataStore';
import { Route } from 'store/data/DataStore.Types';
import { useSystemStore } from 'store/system/SystemStore';

interface Props {
    routes: RouteExtended[];
    query: string;
    getData: (search?: string, filter?: string, limit?: number, index?: number) => void;
}

const LIMIT = 16;

export const RouteSelect: FunctionComponent<Props> = ({ routes: routesAsProps, query }) => {
    const [{ routes: currentRoutes }, { getRoutes, removeAllRoutes }] = useDataStore();
    const [{ routesLoading }, { closeRouteSelect }] = useSystemStore();
    const [routes, setRoutes] = useState<RouteExtended[]>(routesAsProps);
    const [index, setIndex] = useState<number>(1);
    const [inspectorData, setInspectorData] = useState<Route>({ name: '', route: '', color: '' });

    const getFilter = () => {
        return Object.keys(currentRoutes)
            .map((route) => route)
            .join(',');
    };

    const handleScroll = async (e: UIEvent<HTMLDivElement>) => {
        const bottom =
            e.currentTarget.scrollHeight - Math.ceil(e.currentTarget.scrollTop) <= e.currentTarget.clientHeight;
        const filter = getFilter();

        if (bottom) {
            setIndex(index + 1);
            const response = await getRoutes(query, filter, LIMIT, index + 1);

            if (response)
                setRoutes((prevRoutes) => [...prevRoutes, ...response.map((r) => ({ ...r, selected: false }))]);
        }
    };

    useEffect(() => {
        return () => {
            setIndex(1);
            closeRouteSelect();
        };
    }, []); // eslint-disable-line

    useEffect(() => {
        setRoutes(routesAsProps);
    }, [routesAsProps]);

    useEffect(() => {
        if (Object.keys(currentRoutes).length === 0) {
            setRoutes((prevRoutes) => {
                const updatedRoutes: RouteExtended[] = [...prevRoutes];

                prevRoutes.forEach((route, i) => {
                    route.selected = false;
                });

                return updatedRoutes;
            });
        }
    }, [currentRoutes]);

    return (
        <>
            <Inspector data={inspectorData} />
            <Box overflow="auto" onScroll={handleScroll} pb="4">
                {routes.map((route) => (
                    <RouteOption
                        onChange={setRoutes}
                        setInspectorData={setInspectorData}
                        routes={routes}
                        currentRoute={route}
                        key={route.route}
                    />
                ))}

                {routesLoading ? (
                    <Center>
                        <Spinner color="blue.500" />
                    </Center>
                ) : null}
            </Box>
        </>
    );
};
