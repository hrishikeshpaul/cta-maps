import { FunctionComponent, useEffect, useState, ChangeEvent, UIEvent } from 'react';

import {
    Box,
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
    Button,
    useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FiChevronDown, FiSearch } from 'react-icons/fi';
import { IoIosClose } from 'react-icons/io';

import { useDataStore } from 'store/data/DataStore';
import { Route } from 'store/data/DataStore.Types';
import { useSystemStore } from 'store/system/SystemStore';
import useDebounce from 'utils/Hook';
import { Drawer } from 'components/Drawer';

const LIMIT = 10;

interface RouteExtended extends Route {
    selected: boolean;
}

export const RouteSelect: FunctionComponent = () => {
    const { t } = useTranslation();
    const [{ routes: currentRoutes }, { getRoutes, setRoute, removeRoute, removeAllRoutes }] = useDataStore();
    const [{ routeSelectOpen, routesLoading }, { closeRouteSelect }] = useSystemStore();
    const [mounted, setMounted] = useState<boolean>(false);
    const [routes, setRoutes] = useState<RouteExtended[]>([]);
    const [query, setQuery] = useState<string>('');
    const [index, setIndex] = useState<number>(1);
    const debouncedQuery = useDebounce(query);
    const bg = useColorModeValue('white', 'gray.700');

    const handleScroll = async (e: UIEvent<HTMLDivElement>) => {
        const bottom =
            e.currentTarget.scrollHeight - Math.ceil(e.currentTarget.scrollTop) === e.currentTarget.clientHeight;
        const filter = currentRoutes.map((route) => route.route).join(',');

        if (bottom) {
            setIndex(index + 1);
            const response = await getRoutes(query, filter, LIMIT, index + 1);

            if (response)
                setRoutes((prevRoutes) => [...prevRoutes, ...response.map((r) => ({ ...r, selected: false }))]);
        }
    };

    useEffect(() => {
        setMounted(true);

        return () => {
            setMounted(false);
        };
    }, []);

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
            (async () => {
                await onOpen();
            })();
        } else {
            setQuery('');
            setIndex(1);
            closeRouteSelect();
        }
    }, [routeSelectOpen]); // eslint-disable-line

    useEffect(() => {
        (async () => {
            if (debouncedQuery) {
                const filter = currentRoutes.map((route) => route.route).join(',');
                const response = await getRoutes(debouncedQuery, filter, LIMIT, index);

                if (response) {
                    setRoutes(response.map((route) => ({ ...route, selected: false })));
                }
            } else {
                if (mounted) {
                    await onOpen();
                }
            }
        })();
    }, [debouncedQuery]); // eslint-disable-line

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
        <Drawer direction="bottom" open={routeSelectOpen}>
            <Box p="4">
                <Flex justifyContent="space-between" alignItems="center">
                    <Text fontSize="xl" fontWeight="bold">
                        {t('SELECT_ROUTES')}
                    </Text>
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
            </Box>
            <Box px="4" maxH="600px" overflow="auto" onScroll={handleScroll} pb={currentRoutes.length ? '72px' : '4'}>
                {routes.map((route) => (
                    <RouteCard {...route} key={route.route} />
                ))}

                {routesLoading ? (
                    <Center>
                        <Spinner color="blue.500" />
                    </Center>
                ) : null}
            </Box>
            {currentRoutes.length ? (
                <Box position="absolute" bottom="0" left="50%" transform="translate(-50%)" bg={bg} p="4">
                    <Button onClick={removeAllRoutes}>
                        {t('DESELECT_ALL')} ({currentRoutes.length})
                    </Button>
                </Box>
            ) : null}
        </Drawer>
        // <Slide direction="bottom" in={routeSelectOpen} unmountOnExit>
        //     <Container maxW="container.lg" px={{ base: '0', md: '4' }}>
        //         <Box
        //             bg={useColorModeValue('white', 'gray.700')}
        //             borderTopRightRadius="xl"
        //             borderTopLeftRadius="xl"
        //             boxShadow="xl"
        //         >

        //         </Box>
        //     </Container>
        // </Slide>
    );
};
