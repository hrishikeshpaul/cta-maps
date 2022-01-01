import { FunctionComponent, useEffect, useState, ChangeEvent } from 'react';

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
    InputRightElement,
    Spinner,
    Center,
    Switch,
    DrawerFooter,
    Button,
} from '@chakra-ui/react';
import Fuse from 'fuse.js';
import { useTranslation } from 'react-i18next';
import { FiChevronDown, FiSearch } from 'react-icons/fi';
import { IoIosClose } from 'react-icons/io';

import { useDataStore } from '../store/data/DataStore';
import { Route } from '../store/data/DataStore.Types';
import { useSystemStore } from 'store/system/SystemStore';

interface RouteExtended extends Route {
    selected: boolean;
}

const fuseOptions = {
    keys: ['route', 'name'],
};

export const RouteSelect: FunctionComponent = () => {
    const { t } = useTranslation();
    const [{ routes: currentRoutes }, { getRoutes, setRoute, removeRoute, removeAllRoutes }] = useDataStore();
    const [{ routeSelectOpen, routesLoading }, { closeRouteSelect }] = useSystemStore();
    const [routes, setRoutes] = useState<RouteExtended[]>([]);
    const [computedRoutes, setComputedRoutes] = useState<RouteExtended[]>([]);
    const [query, setQuery] = useState<string>('');
    const fuse = new Fuse(routes!, fuseOptions);

    useEffect(() => {
        if (routeSelectOpen) {
            (async () => {
                const responseRoutes = await getRoutes();
                const selectedRoutes: RouteExtended[] = [];
                const unselectedRoutes: RouteExtended[] = [];

                responseRoutes?.forEach((route) => {
                    const foundRouteIdx = currentRoutes.findIndex((r) => r.route === route.route);
                    if (foundRouteIdx !== -1) {
                        selectedRoutes.push({ ...route, selected: true });
                    } else {
                        unselectedRoutes.push({ ...route, selected: false });
                    }
                });

                setRoutes([...selectedRoutes, ...unselectedRoutes]);
                setComputedRoutes([...selectedRoutes, ...unselectedRoutes]);
            })();
        }
    }, [routeSelectOpen]); // eslint-disable-line

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
    }, [currentRoutes]); // eslint-disable-line

    useEffect(() => {
        if (query) {
            const results = fuse.search(query);
            const computed: RouteExtended[] = [];

            results.forEach((result) => {
                computed.push(result.item);
            });

            setComputedRoutes(computed);
        } else {
            if (routes) setComputedRoutes(routes);
        }
    }, [query]); // eslint-disable-line

    const RouteCard: FunctionComponent<RouteExtended> = ({ route, name, color, selected }) => {
        const onToggle = () => {
            const computedRouteIdx = computedRoutes.findIndex((r) => r.route === route);

            if (!selected) {
                setRoute({ route, name, color });
                if (computedRouteIdx !== -1) {
                    const old = [...computedRoutes];
                    old[computedRouteIdx].selected = true;
                    setComputedRoutes([...old]);
                }
            } else {
                removeRoute(route);
                if (computedRouteIdx !== -1) {
                    const old = [...computedRoutes];
                    old[computedRouteIdx].selected = false;
                    setComputedRoutes([...old]);
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
        <Drawer isOpen={routeSelectOpen} placement="bottom" onClose={() => closeRouteSelect()} autoFocus={false}>
            <DrawerOverlay />
            <DrawerContent height="85%" borderRadius="xl">
                <DrawerHeader px="4">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text fontWeight="bold">{t('SELECT_ROUTES')}</Text>
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
                        {query && (
                            <InputRightElement>
                                <IconButton
                                    variant="ghost"
                                    aria-label="clear"
                                    icon={<IoIosClose />}
                                    size="sm"
                                    fontSize="3xl"
                                    color="gray.500"
                                    onClick={() => setQuery('')}
                                />
                            </InputRightElement>
                        )}
                        <Input
                            name="query"
                            value={query}
                            placeholder={t('ROUTE_SEARCH_PLACEHOLDER')}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setQuery(e.target.value);
                            }}
                        />
                    </InputGroup>
                </DrawerHeader>

                <DrawerBody px="4">
                    {routesLoading ? (
                        <Center>
                            <Spinner color="blue.500" />
                        </Center>
                    ) : (
                        <>
                            {computedRoutes.map((route) => (
                                <RouteCard {...route} key={route.route} />
                            ))}
                        </>
                    )}
                </DrawerBody>
                {currentRoutes.length ? (
                    <DrawerFooter justifyContent="center">
                        <Button onClick={removeAllRoutes}>
                            {t('DESELECT_ALL')} ({currentRoutes.length})
                        </Button>
                    </DrawerFooter>
                ) : null}
            </DrawerContent>
        </Drawer>
    );
};
