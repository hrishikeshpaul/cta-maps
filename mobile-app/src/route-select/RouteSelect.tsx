import React, { FunctionComponent, useRef, useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

import { Box, View, Text, useColorModeValue, Flex, Center, Switch, Input, IconButton } from 'native-base';

import RBSheet from 'react-native-raw-bottom-sheet';
import { useSystemStore } from '../store/system/SystemStore';
import { useDataStore } from '../store/data/DataStore';
import { Route } from '../store/data/DataStore.Types';
import useDebounce from '../utils/Hook';

const LIMIT = 10;

interface RouteExtended extends Route {
    selected: boolean;
}

export const RouteSelect: FunctionComponent = () => {
    const [{ routes: currentRoutes }, { getRoutes, setRoute, removeRoute, removeAllRoutes }] = useDataStore();
    const [{ routeSelectOpen, routesLoading }, { closeRouteSelect }] = useSystemStore();
    const [mounted, setMounted] = useState<boolean>(false);
    const [routes, setRoutes] = useState<RouteExtended[]>([]);
    const [query, setQuery] = useState<string>('');
    const [index, setIndex] = useState<number>(1);
    const debouncedQuery = useDebounce(query);
    const bg = useColorModeValue('white', 'gray.700');
    const refRBSheet = useRef<any>(null);

    const onOpen = async () => {
        const filter = currentRoutes.map((route) => route.route).join(',');
        const response = await getRoutes(query, filter, LIMIT, index);
        const selectedRoutes: RouteExtended[] = currentRoutes.map((route) => ({ ...route, selected: true }));
        let unselectedRoutes: RouteExtended[] = [];

        if (response) {
            unselectedRoutes = response.map((route) => ({ ...route, selected: false }));
        }

        setRoutes([...selectedRoutes, ...unselectedRoutes]);
    };

    useEffect(() => {
        if (routeSelectOpen) {
            refRBSheet.current.open();
            (async () => {
                await onOpen();
            })();
        } else {
            setQuery('');
            setIndex(1);
            closeRouteSelect();
        }
    }, [routeSelectOpen]); // eslint-disable-line

    const RouteCard: FunctionComponent<RouteExtended> = ({ route, name, color, selected }) => {
        const onToggle = () => {
            const computedRouteIdx = routes.findIndex((r) => r.route === route);

            if (!selected) {
                setRoute({ route, name, color });
                if (computedRouteIdx !== -1) {
                    const old = [...routes];

                    old[computedRouteIdx].selected = true;
                    setRoutes([...old]);
                }
            } else {
                removeRoute(route);
                if (computedRouteIdx !== -1) {
                    const old = [...routes];

                    old[computedRouteIdx].selected = false;
                    setRoutes([...old]);
                }
            }
        };

        return (
            <Flex justifyContent="space-between" alignItems="center" py="3">
                <Flex alignItems="center" overflow="hidden">
                    <Center h="40px" w="40px" bg={color} borderRadius="md">
                        <Text color="white" fontWeight="bold">
                            {route}
                        </Text>
                    </Center>
                    <Text px="4" isTruncated fontWeight={500}>
                        {name}
                    </Text>
                </Flex>
                <Switch size="lg" isChecked={selected} onChange={onToggle} />
            </Flex>
        );
    };

    return (
        <View shadow="9">
            <RBSheet
                ref={refRBSheet}
                animationType="slide"
                closeOnDragDown={true}
                closeOnPressMask={false}
                height={Dimensions.get('window').height * 0.8}
                onClose={() => closeRouteSelect()}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'transparent',
                        borderRadius: 8,
                    },
                    draggableIcon: {
                        backgroundColor: '#ececec',
                    },
                }}
            >
                <Box px="4" borderRadius="xl">
                    <Flex direction="row" justifyContent="space-between" alignItems="center">
                        <Text fontSize="xl" fontWeight="bold">
                            {/* {t('SELECT_ROUTES')} */}
                            Select Routes
                        </Text>
                    </Flex>
                </Box>
            </RBSheet>
        </View>
    );
};
