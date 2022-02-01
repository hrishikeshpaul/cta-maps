import { FunctionComponent, useEffect, useState } from 'react';

import { Box, IconButton, Tab, TabList, Tabs, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { RouteExtended } from 'screens/search/route-select/RouteOption';
import { RouteSelect } from 'screens/search/route-select/RouteSelect';
import { useDataStore } from 'store/data/DataStore';
import { SearchIcon } from 'utils/Icons';
import { Screen } from 'shared/screen/Screen';
import { useTranslation } from 'react-i18next';
import { useSystemStore } from 'store/system/SystemStore';
import { SCROLL_THRESHOLD } from 'utils/Constants';

const LIMIT = 16;

enum TabIndex {
    Bus,
    Train,
}

export const SearchView: FunctionComponent = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [{ routes: currentRoutes }, { getRoutes, getTrainRoutes }] = useDataStore();
    const [
        {
            ui: { scrollTop },
        },
    ] = useSystemStore();
    const [routes, setRoutes] = useState<RouteExtended[]>([]);
    const [query, setQuery] = useState<string>('');
    const [index, setIndex] = useState<number>(0);

    const [scrolled, setScrolled] = useState<boolean>(false);
    const bg = useColorModeValue('white', 'gray.800');

    useEffect(() => {
        if (scrollTop > SCROLL_THRESHOLD) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    }, [scrollTop]);

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
        console.log('index');

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
                <Tabs isFitted onChange={setIndex}>
                    <TabList
                        position="fixed"
                        top={!scrolled ? '140px' : '110px'}
                        w="100%"
                        zIndex={1}
                        backgroundColor={bg}
                        transition="top 0.2s ease-in-out"
                        left="50%"
                        transform="translate(-50%)"
                        maxW="container.sm"
                    >
                        <Tab fontSize="sm" fontWeight="600">
                            {t('BUS')}
                        </Tab>
                        <Tab fontSize="sm" fontWeight="600">
                            {t('TRAIN')}
                        </Tab>
                    </TabList>
                </Tabs>

                <Box pt="48px">
                    <RouteSelect routes={routes} />
                </Box>
            </Screen>
        </Box>
    );
};
