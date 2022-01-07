import React, { FunctionComponent, useRef, useEffect, useState } from 'react';
import { Dimensions, TouchableOpacity, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

import { Ionicons, AntDesign } from '@expo/vector-icons';
import {
    Box,
    View,
    Text,
    useColorModeValue,
    Flex,
    Center,
    Switch,
    Input,
    Spinner,
    Button,
    ScrollView,
    Icon,
    IconButton,
    Divider,
} from 'native-base';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();

    const [{ routes: currentRoutes }, { getRoutes, setRoute, removeRoute, removeAllRoutes }] = useDataStore();
    const [{ routeSelectOpen, routesLoading }, { closeRouteSelect, setRouteLoading }] = useSystemStore();
    const [mounted, setMounted] = useState<boolean>(false);
    const [routes, setRoutes] = useState<RouteExtended[]>([]);
    const [query, setQuery] = useState<string>('');
    const [index, setIndex] = useState<number>(1);
    const [isScrolling, setIsScrolling] = useState<boolean>(false);
    const debouncedQuery = useDebounce(query);
    const bg = useColorModeValue('white', 'gray.700');
    const refRBSheet = useRef<RBSheet | null>(null);
    const [bsOpenFinish, setBsOpenFinish] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);

        return () => {
            setMounted(false);
        };
    }, []);

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent) => {
        const paddingToBottom = 4;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    };

    const handleScroll = async ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (isCloseToBottom(nativeEvent) && !routesLoading) {
            console.log('here');
            setIndex(index + 1);
            const filter = currentRoutes.map((route) => route.route).join(',');
            const response = await getRoutes(query, filter, LIMIT, index + 1);

            if (response)
                setRoutes((prevRoutes) => [...prevRoutes, ...response.map((r) => ({ ...r, selected: false }))]);
        }
    };

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
            refRBSheet!.current!.open();
            (async () => {
                await onOpen();
            })();
        } else {
            setBsOpenFinish(false);
            setQuery('');
            setIndex(1);
            closeRouteSelect();
        }
    }, [routeSelectOpen]); // eslint-disable-line

    useEffect(() => {
        if (currentRoutes.length === 0) {
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

    useEffect(() => {
        if (query) setRouteLoading(true);
        else setRouteLoading(false);
    }, [query]);

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
            <TouchableOpacity activeOpacity={1}>
                <Flex justifyContent="space-between" alignItems="center" direction="row">
                    <Flex alignItems="center" overflow="hidden" direction="row">
                        <Center h="40px" w="40px" bg={color} borderRadius="md">
                            <Text fontSize="md" color="white" fontWeight="bold">
                                {route}
                            </Text>
                        </Center>
                        <Text fontSize="md" px="4" isTruncated fontWeight={500}>
                            {name}
                        </Text>
                    </Flex>
                    <Switch colorScheme="blue" size="lg" isChecked={selected} onChange={onToggle} />
                </Flex>
                <Divider />
            </TouchableOpacity>
        );
    };

    return (
        <View shadow="9" style={{ height: '100%' }}>
            <RBSheet
                ref={refRBSheet}
                onOpen={() => {
                    setTimeout(() => {
                        setBsOpenFinish(true);
                    }, 400);
                }}
                animationType="fade"
                closeOnDragDown={!isScrolling}
                closeOnPressMask={false}
                height={Dimensions.get('window').height * 0.8}
                onClose={() => closeRouteSelect()}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'transparent',
                    },
                    draggableIcon: {
                        display: 'none',
                        backgroundColor: '#ececec',
                    },
                    container: {
                        backgroundColor: bg,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        shadowColor: 'black',
                        shadowRadius: 10,
                    },
                }}
            >
                <Flex bg={bg} p="4" pb="0" justifyContent="center" direction="row">
                    <Box h="1" bg="gray.300" w="10" borderRadius="xl" />
                </Flex>
                <Box p="4" borderRadius="xl" pt="0">
                    <Flex direction="row" justifyContent="space-between" alignItems="center" py="2">
                        <Text fontSize="2xl" fontWeight="900">
                            {t('SELECT_ROUTES')}
                        </Text>
                    </Flex>
                    <Box pt="1">
                        <Input
                            fontSize="md"
                            fontWeight="400"
                            _focus={{ borderColor: 'blue.500', borderWidth: 2 }}
                            onChangeText={(text) => {
                                setQuery(text);
                            }}
                            defaultValue={query}
                            borderRadius="xl"
                            placeholder={t('ROUTE_SEARCH_PLACEHOLDER')}
                            InputRightElement={
                                query && routesLoading ? (
                                    <Spinner color="blue.500" mr="2" />
                                ) : query ? (
                                    <IconButton
                                        variant="ghost"
                                        aria-label="clear"
                                        px="2"
                                        icon={
                                            <Icon
                                                as={<AntDesign name="close" size={24} />}
                                                size={5}
                                                ml="2"
                                                color="muted.400"
                                            />
                                        }
                                        _pressed={{ bg: 'transparent', color: 'black' }}
                                        size="sm"
                                        fontSize="3xl"
                                        color="gray.500"
                                        onPress={() => setQuery('')}
                                    />
                                ) : (
                                    <></>
                                )
                            }
                            InputLeftElement={
                                <Icon
                                    as={<Ionicons name="search-outline" size={24} color="black" />}
                                    size={5}
                                    ml="2"
                                    color="muted.400"
                                />
                            }
                        />
                    </Box>
                </Box>
                <ScrollView
                    px="4"
                    pb={currentRoutes.length ? '14' : '4'}
                    pt="2"
                    onScroll={handleScroll}
                    onScrollBeginDrag={() => setIsScrolling(true)}
                    onScrollEndDrag={() => setIsScrolling(false)}
                    scrollEventThrottle={400}
                >
                    {bsOpenFinish && routes.map((route) => <RouteCard {...route} key={route.route} />)}
                    {routesLoading ? (
                        <Center>
                            <Spinner color="blue.500" />
                        </Center>
                    ) : null}
                </ScrollView>

                {currentRoutes.length ? (
                    <Flex bg={bg} p="4" justifyContent="center" direction="row">
                        <Button onPress={() => removeAllRoutes()} w="50%" colorScheme="light" borderRadius="xl">
                            {t('DESELECT_ALL')}
                        </Button>
                    </Flex>
                ) : null}
            </RBSheet>
        </View>
    );
};
