import { FunctionComponent, useEffect, useState } from 'react';

import { Box, IconButton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { RouteExtended } from 'screens/search/route-select/RouteOption';
import { RouteSelect } from 'screens/search/route-select/RouteSelect';
import { useDataStore } from 'store/data/DataStore';
import { SearchIcon } from 'utils/Icons';
import { Screen } from 'shared/screen/Screen';
import { RouteTabs } from '../route-tabs/RouteTabs';

const LIMIT = 16;

enum TabIndex {
    Bus,
    Train,
}

export const SearchView: FunctionComponent = () => {
    const navigate = useNavigate();
    const [{ routes: currentRoutes }, { getRoutes, getTrainRoutes }] = useDataStore();
    const [routes, setRoutes] = useState<RouteExtended[]>([]);
    const [query, setQuery] = useState<string>('');
    const [index, setIndex] = useState<number>(0);

    const getFilter = () => {
        return Object.keys(currentRoutes)
            .map((route) => route)
            .join(',');
    };

    const getBusRoutes = async () => {
        const filter = getFilter();
        const response = await getRoutes(query, filter, LIMIT, 1);
        const selectedRoutes: RouteExtended[] = Object.values(currentRoutes).map((route) => ({
            ...route,
            selected: true,
        }));
        let unselectedRoutes: RouteExtended[] = [];

        if (response) {
            unselectedRoutes = response.map((route) => ({ ...route, selected: false }));
        }

        setRoutes([...selectedRoutes, ...unselectedRoutes]);
    };

    const computeTrainRoutes = async () => {
        const response = await getTrainRoutes();
        const selectedRoutes: RouteExtended[] = Object.values(currentRoutes).map((route) => ({
            ...route,
            selected: true,
        }));
        let unselectedRoutes: RouteExtended[] = [];

        if (response) {
            unselectedRoutes = response.map((route) => ({ ...route, selected: false }));
        }

        setRoutes([...selectedRoutes, ...unselectedRoutes]);
    };

    useEffect(() => {
        (async () => {
            setRoutes([]);

            if (index === TabIndex.Bus) {
                await getBusRoutes();
            } else {
                await computeTrainRoutes();
            }
        })();

        return () => {
            setQuery('');
        };
    }, [index]); // eslint-disable-line

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
        <Box>
            <Screen
                pb="2"
                title="SEARCH"
                headerIcon={
                    <IconButton
                        aria-label="search"
                        variant="ghost"
                        fontSize="xl"
                        icon={<SearchIcon />}
                        onClick={() => navigate('/search/query')}
                    />
                }
            >
                <RouteTabs.Tabs isLazy onChange={setIndex}>
                    <RouteTabs.Tab name="BUS">
                        <RouteSelect routes={routes} query="" />
                    </RouteTabs.Tab>
                    <RouteTabs.Tab name="TRAIN">
                        <RouteSelect routes={routes} query="" />
                    </RouteTabs.Tab>
                </RouteTabs.Tabs>
            </Screen>
        </Box>
    );
};
