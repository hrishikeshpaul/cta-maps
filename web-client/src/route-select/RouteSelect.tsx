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

export const RouteSelect: FunctionComponent = () => {
    const [{ routeSelectOpen, routesLoading }, { closeRouteSelect, getRoutes }] = useStore();
    const [routes, setRoutes] = useState<Route[] | null>([]);

    useEffect(() => {
        if (routeSelectOpen) {
            (async () => {
                const routes = await getRoutes();

                setRoutes(routes);
            })();
        }
    }, [routeSelectOpen]);

    const RouteCard: FunctionComponent<Route> = ({ route, name, color }) => {
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
                <Switch size="lg" />
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
