import React, { FunctionComponent, useRef, useEffect, useState, useMemo, useCallback } from 'react';
import {
    Dimensions,
    TouchableOpacity,
    NativeScrollEvent,
    NativeSyntheticEvent,
    TextInputTextInputEventData,
} from 'react-native';

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
} from 'native-base';
import { useTranslation } from 'react-i18next';
import { Ionicons, AntDesign } from '@expo/vector-icons';

import BottomSheet from '@gorhom/bottom-sheet';

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
    const bottomSheetRef = useRef<BottomSheet>(null);

    const [{ routes: currentRoutes }, { getRoutes, setRoute, removeRoute, removeAllRoutes }] = useDataStore();
    const [{ routeSelectOpen, routesLoading }, { closeRouteSelect }] = useSystemStore();
    const [mounted, setMounted] = useState<boolean>(false);
    const [routes, setRoutes] = useState<RouteExtended[]>([]);
    const [query, setQuery] = useState<string>('');
    const [index, setIndex] = useState<number>(1);
    const [isScrolling, setIsScrolling] = useState<boolean>(false);
    const debouncedQuery = useDebounce(query);
    const bg = useColorModeValue('white', 'gray.700');
    const refRBSheet = useRef<any>(null);

    const snapPoints = useMemo(() => ['25%', '50%'], []);

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
            console.log('reached-bottom');
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
            </TouchableOpacity>
        );
    };

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    return (
        <View shadow="9" style={{ height: '100%' }}>
            <RBSheet
                ref={refRBSheet}
                animationType="slide"
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
                {/* <BottomSheet ref={bottomSheetRef} index={1} snapPoints={snapPoints} onChange={handleSheetChanges}> */}
                <Box p="4" borderRadius="xl" py="2">
                    <Flex direction="row" justifyContent="space-between" alignItems="center" py="2">
                        <Text fontSize="2xl" fontWeight="bold">
                            {t('SELECT_ROUTES')}
                        </Text>
                    </Flex>
                    <Box pt="1">
                        <Input
                            fontSize="lg"
                            fontWeight="400"
                            _focus={{ borderColor: 'blue.500', borderWidth: 2 }}
                            onTextInput={({
                                nativeEvent: { text },
                            }: NativeSyntheticEvent<TextInputTextInputEventData>) => {
                                setQuery(text);
                            }}
                            value={query}
                            borderRadius="xl"
                            placeholder={t('ROUTE_SEARCH_PLACEHOLDER')}
                            InputRightElement={
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
                    pb={currentRoutes.length ? '12' : '4'}
                    pt="2"
                    onScroll={handleScroll}
                    onScrollBeginDrag={() => setIsScrolling(true)}
                    onScrollEndDrag={() => setIsScrolling(false)}
                    scrollEventThrottle={400}
                >
                    {routes.map((route) => (
                        <RouteCard {...route} key={route.route} />
                    ))}
                    {routesLoading ? (
                        <Center>
                            <Spinner color="blue.500" />
                        </Center>
                    ) : null}
                </ScrollView>

                {currentRoutes.length ? (
                    <Box position="absolute" bottom="0" left="50%" bg={bg} p="4">
                        <Button onPress={() => removeAllRoutes()}>
                            {t('DESELECT_ALL')} ({currentRoutes.length})
                        </Button>
                    </Box>
                ) : null}
                {/* </BottomSheet> */}
            </RBSheet>
        </View>
    );
};
