import { FunctionComponent, useEffect, useState } from 'react';

import {
    Center,
    Box,
    Text,
    IconButton,
    Flex,
    useToast,
    Spinner,
    Badge,
    Button,
    Divider,
    Avatar,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { BottomSheet } from 'shared/bottom-sheet/BottomSheet';
import { FavoriteIcon } from 'shared/favorite-icon/FavoriteIcon';
import { useDataStore } from 'store/data/DataStore';
import { getPredictions, getRouteColor } from 'store/data/DataService';
import { Juncture, Prediction, RouteColor } from 'store/data/DataStore.Types';
import { DownIcon, LocationArrowIcon } from 'utils/Icons';

import 'shared/stop/Stop.scss';

export const Stop: FunctionComponent = () => {
    const { t } = useTranslation();
    const [{ stop, favoriteStops }, { closeStop, saveStop, unSaveStop }] = useDataStore();
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [colors, setColors] = useState<RouteColor>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [routes, setRoutes] = useState<string[]>([]);
    const [filter, setFilter] = useState<Record<string, boolean>>({});
    const [isFav, setIsFav] = useState<boolean>(false);
    const toast = useToast();
    const JunctureMapper = {
        [Juncture.A]: (time: number) => (time < 2 ? t('ARRIVE_SHORTLY') : `${t('ARRIVE')} ${time} mins`),
        [Juncture.D]: (time: number) => (time < 2 ? t('DEPART_SHORTLY') : `${t('DEPART')} ${time} mins`),
    };

    useEffect(() => {
        if (stop && favoriteStops[stop.id]) {
            setIsFav(true);
        } else {
            setIsFav(false);
        }
    }, [favoriteStops, stop]); // eslint-disable-line

    useEffect(() => {
        if (stop) {
            (async () => {
                try {
                    setLoading(true);
                    const response = await getPredictions(stop.id);
                    const responseRoutes: Set<string> = new Set();

                    response.forEach((res) => {
                        responseRoutes.add(res.route);
                    });

                    const routeColors = await getRouteColor(Array.from(responseRoutes).join(','));

                    setTimeout(() => {
                        setColors(routeColors);
                        setRoutes(Array.from(responseRoutes));
                        setPredictions(response);
                        setLoading(false);
                    }, 500);
                } catch (err: any) {
                    setLoading(false);
                    toast({
                        description: err.response.data,
                        status: 'warning',
                    });
                }
            })();
        } else {
            setPredictions([]);
            setRoutes([]);
        }
    }, [stop, toast]);

    const getGoogleMapsDir = () => {
        if (stop) {
            window.open(`https://www.google.com/maps/dir/?api=1&&destination=${stop.lat},${stop.lng}`, '_blank');
        }
    };

    const onFilterChange = (route: string) => {
        if (filter[route]) {
            const oldFilter = { ...filter };
            delete oldFilter[route];

            setFilter({ ...oldFilter });
        } else {
            setFilter({ ...filter, [route]: true });
        }
    };

    const onFavHandle = () => {
        if (stop && favoriteStops[stop.id]) {
            unSaveStop(stop!.id);
        } else {
            saveStop(stop!);
        }
    };

    const RenderPred: FunctionComponent<Prediction> = ({
        route,
        type,
        time,
        delayed,
        timestamp,
        vehicleId,
        destination,
    }) => {
        const PredictionCard: FunctionComponent = () => (
            <>
                <Flex justifyContent="space-between" alignItems="center" py="4" overflow="hidden">
                    <Flex alignItems="center" overflow="hidden">
                        <Avatar
                            name={route}
                            getInitials={(str) => str}
                            color="white"
                            fontSize="sm"
                            fontWeight="500"
                            p="4"
                            h="40px"
                            w="40px"
                            borderRadius="lg"
                            bg={colors[route]}
                            ignoreFallback
                        />
                        <Box overflow="hidden" px="3">
                            <Flex overflow="hidden" alignItems="center">
                                <Text fontWeight={500} isTruncated>
                                    {JunctureMapper[type](time)}
                                </Text>
                                {delayed && (
                                    <Badge size="xs" fontSize="10px" mt="1" ml="2" colorScheme="orange">
                                        {t('DELAYED')}
                                    </Badge>
                                )}
                            </Flex>
                            <Flex fontSize="sm" alignItems="center" overflow="hidden" maxW="100%">
                                <Badge>{vehicleId}</Badge>
                                <Text isTruncated pl="1">
                                    {destination}
                                </Text>
                            </Flex>
                        </Box>
                    </Flex>

                    <Text textAlign="right" fontWeight={500} flexShrink={0}>
                        {timestamp}
                    </Text>
                </Flex>
                <Divider />
            </>
        );

        if (Object.keys(filter).length && filter[route]) {
            return <PredictionCard />;
        } else if (Object.keys(filter).length === 0) {
            return <PredictionCard />;
        }

        return <></>;
    };

    return (
        <BottomSheet.Wrapper isOpen={!!stop} onClose={closeStop} zIndex={1500}>
            <BottomSheet.Header>
                <Flex justifyContent="space-between" alignItems="center">
                    <Text fontWeight="bold" fontSize="2xl">
                        {stop?.name}
                    </Text>
                    <IconButton
                        variant="ghost"
                        fontSize="2xl"
                        aria-label="close"
                        mr="-3"
                        onClick={closeStop}
                        icon={<DownIcon />}
                    />
                </Flex>
                <Flex pt="4" overflowX="auto">
                    {routes.map((route) => (
                        <Button
                            mr="4"
                            mb="2"
                            key={route}
                            onClick={() => onFilterChange(route)}
                            colorScheme={filter[route] ? 'blue' : 'gray'}
                        >
                            {route}
                        </Button>
                    ))}
                </Flex>
            </BottomSheet.Header>
            <BottomSheet.Body>
                <Box h="50vh" overflowY="auto" px="4">
                    {loading ? (
                        <Center>
                            <Spinner />
                        </Center>
                    ) : (
                        <Box>
                            {predictions.length ? (
                                <>
                                    {predictions.map((prediction) => (
                                        <RenderPred {...prediction} key={prediction.id} />
                                    ))}
                                </>
                            ) : (
                                <Text>{t('NO_SCHEDULE_AVAILABLE')}</Text>
                            )}
                        </Box>
                    )}
                </Box>
            </BottomSheet.Body>
            <BottomSheet.Footer>
                <Flex justifyContent="space-between" w="100%">
                    <Button rightIcon={<LocationArrowIcon fontSize="22px" />} onClick={getGoogleMapsDir}>
                        <Text>{t('GET_DIR')}</Text>
                    </Button>
                    <FavoriteIcon ariaLabel="favorite-stop" isFav={isFav} onClick={onFavHandle} />
                </Flex>
            </BottomSheet.Footer>
        </BottomSheet.Wrapper>
    );
};
