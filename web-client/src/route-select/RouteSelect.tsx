import React, { FunctionComponent, useEffect, useState } from 'react';

import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    Text,
    IconButton,
    Flex,
    InputGroup,
    Input,
    InputLeftElement,
    Spinner,
    Center,
    Switch,
} from '@chakra-ui/react';
import { FiChevronDown, FiSearch } from 'react-icons/fi';

import { useStore } from '../store/Store';
import { Route } from '../store/Store.Types';

interface RouteExtended extends Route {
    selected: boolean;
}

export const RouteSelect: FunctionComponent = () => {
    const [
        { routeSelectOpen, routesLoading, routes: currentRoutes },
        { closeRouteSelect, getRoutes, setRoute, removeRoute },
    ] = useStore();
    const [routes, setRoutes] = useState<RouteExtended[] | null>([]);

    useEffect(() => {
        if (routeSelectOpen) {
            (async () => {
                const routes = await getRoutes();
                const mutatedRoutes: RouteExtended[] = [];

                routes?.forEach((route) => {
                    const foundRouteIdx = currentRoutes.findIndex((r) => r.route === route.route);
                    if (foundRouteIdx !== -1) {
                        mutatedRoutes.push({ ...route, selected: true });
                    } else {
                        mutatedRoutes.push({ ...route, selected: false });
                    }
                });
                setRoutes(mutatedRoutes);
            })();
        }
    }, [routeSelectOpen]);

    useEffect(() => {
        const mutatedRoutes: RouteExtended[] = [];

        routes?.forEach((route) => {
            const foundRouteIdx = currentRoutes.findIndex((r) => r.route === route.route);
            if (foundRouteIdx !== -1) {
                mutatedRoutes.push({ ...route, selected: true });
            } else {
                mutatedRoutes.push({ ...route, selected: false });
            }
        });
        setRoutes(mutatedRoutes);
    }, [currentRoutes]);

    const RouteCard: FunctionComponent<RouteExtended> = ({ route, name, color, selected }) => {
        const onToggle = () => {
            if (!selected) {
                setRoute({ route, name, color });
            } else {
                removeRoute(route);
            }
        };

        return (
            <Flex justifyContent="space-between" alignItems="center" py="3">
                <Flex alignItems="center">
                    <Center h="40px" w="40px" bg={color} borderRadius="md">
                        <Text color="white" fontWeight="bold">
                            {route}
                        </Text>
                    </Center>
                    <Text px="4" isTruncated fontWeight="semibold">
                        {name}
                    </Text>
                </Flex>
                <Switch size="lg" onChange={onToggle} isChecked={selected} />
            </Flex>
        );
    };

    return (
        <Drawer
            isOpen={routeSelectOpen}
            placement="bottom"
            isFullHeight
            onClose={() => closeRouteSelect()}
            autoFocus={false}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader px="4">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text>Select Routes</Text>
                        <IconButton
                            variant="ghost"
                            fontSize="2xl"
                            aria-label="close"
                            mr="-3"
                            onClick={closeRouteSelect}
                            icon={<FiChevronDown />}
                        />
                    </Flex>
                    <InputGroup mt="2">
                        <InputLeftElement pointerEvents="none" children={<FiSearch color="gray.300" />} />
                        <Input placeholder="Bus Number..." />
                    </InputGroup>
                </DrawerHeader>

                <DrawerBody px="4">
                    {routesLoading ? (
                        <Center>
                            <Spinner />
                        </Center>
                    ) : (
                        <>
                            {routes !== null ? (
                                <>
                                    {routes.map((route) => (
                                        <RouteCard {...route} key={route.route} />
                                    ))}
                                </>
                            ) : (
                                'Error'
                            )}
                        </>
                    )}
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};
