import { FunctionComponent, useEffect, useState } from 'react';

import { Box, IconButton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { RouteExtended } from 'screens/search/route-select/RouteOption';
import { RouteSelect } from 'screens/search/route-select/RouteSelect';
import { useDataStore } from 'store/data/DataStore';
import useDebounce from 'utils/Hook';
import { SearchIcon } from 'utils/Icons';
import { BasePage } from 'utils/BasePage';

const LIMIT = 16;

export const SearchView: FunctionComponent = () => {
    const navigate = useNavigate();
    const [{ routes: currentRoutes }, { getRoutes }] = useDataStore();
    const [routes, setRoutes] = useState<RouteExtended[]>([]);
    const [query, setQuery] = useState<string>('');
    const [index, setIndex] = useState<number>(1);
    const debouncedQuery = useDebounce(query);

    const getFilter = () => {
        return Object.keys(currentRoutes)
            .map((route) => route)
            .join(',');
    };

    const onOpen = async () => {
        const filter = getFilter();
        const response = await getRoutes(query, filter, LIMIT, index);
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
            await onOpen();
        })();

        return () => {
            setQuery('');
            setIndex(1);
        };
    }, []); // eslint-disable-line

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

    useEffect(() => {
        (async () => {
            if (debouncedQuery) {
                const filter = getFilter();
                const response = await getRoutes(debouncedQuery, filter, LIMIT, 1);

                if (response) {
                    setRoutes(response.map((route) => ({ ...route, selected: false })));
                }
            }
        })();
    }, [debouncedQuery]); // eslint-disable-line

    return (
        <Box>
            <BasePage
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
                <RouteSelect routes={routes} query="" getData={getRoutes} />
            </BasePage>
        </Box>
    );
};
