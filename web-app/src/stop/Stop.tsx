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
    useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BsHeartFill, BsHeart } from 'react-icons/bs';
import { FaLocationArrow } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';

import { useDataStore } from 'store/data/DataStore';
import { getPredictions } from 'store/data/DataService';
import { Juncture, Prediction } from 'store/data/DataStore.Types';
import { Drawer } from 'components/Drawer';

export const Stop: FunctionComponent = () => {
    const { t } = useTranslation();
    const [{ stop, favorites }, { closeStop, saveStop, unSaveStop }] = useDataStore();
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [routes, setRoutes] = useState<string[]>([]);
    const [filter, setFilter] = useState<Record<string, boolean>>({});
    const [isFav, setIsFav] = useState<boolean>(false);
    const toast = useToast();
    const JunctureMapper = {
        [Juncture.A]: (time: number) => (time < 2 ? t('ARRIVE_SHORTLY') : `${t('ARRIVE')} ${time} mins`),
        [Juncture.D]: (time: number) => (time < 2 ? t('DEPART_SHORTLY') : `${t('DEPART')} ${time} mins`),
    };
    const bg = useColorModeValue('white', 'gray.700');

    useEffect(() => {
        if (stop && favorites[stop.id]) {
            setIsFav(true);
        } else {
            setIsFav(false);
        }
    }, [favorites, stop]); // eslint-disable-line

    useEffect(() => {
        (async () => {
            try {
                if (stop) {
                    setLoading(true);
                    const response = await getPredictions(stop.id);
                    const responseRoutes: Set<string> = new Set();

                    response.forEach((res) => {
                        responseRoutes.add(res.route);
                    });

                    setRoutes(Array.from(responseRoutes));
                    setPredictions(response);
                    setLoading(false);
                }
            } catch (err: any) {
                setLoading(false);
                toast({
                    description: err.response.data,
                    status: 'error',
                });
            }
        })();
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
        if (stop && favorites[stop.id]) {
            unSaveStop(stop!.id);
        } else {
            saveStop(stop!);
        }
    };

    const RenderPred: FunctionComponent<Prediction> = ({ route, type, time, delayed, timestamp, direction }) => {
        const PredictionCard: FunctionComponent = () => (
            <>
                <Flex justifyContent="space-between" alignItems="center" py="4">
                    <Flex alignItems="center">
                        <Center h="30px" w="30px">
                            <Text fontWeight="bold">{route}</Text>
                        </Center>
                        <Box pl="2">
                            <Text>
                                <Text as="span" fontWeight={500}>
                                    {JunctureMapper[type](time)}
                                </Text>
                                {delayed && (
                                    <Badge size="xs" colorScheme="orange" ml="2">
                                        {t('DELAYED')}
                                    </Badge>
                                )}
                            </Text>
                            <Text fontSize="xs">{t(direction)}</Text>
                        </Box>
                    </Flex>
                    <Text fontWeight={500}>{timestamp}</Text>
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
        <Drawer open={!!stop} direction="bottom">
            <Box position="relative">
                <Flex justifyContent="space-between" alignItems="center" overflow="hidden" p="4">
                    <Text fontSize="2xl" isTruncated fontWeight="bold">
                        {stop?.name}
                    </Text>
                    <IconButton
                        variant="ghost"
                        fontSize="2xl"
                        mr="-3"
                        aria-label="close"
                        onClick={() => {
                            closeStop();
                            setFilter({});
                            setIsFav(false);
                        }}
                        icon={<FiChevronDown />}
                    />
                </Flex>
                <Flex pb="2" overflowX="auto" px="4">
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
                <Box h="60vh" pb="72px" overflowY="auto" px="4">
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
                <Box position="absolute" bottom="0" left="50%" transform="translate(-50%)" bg={bg} p="4" w="100%">
                    <Flex justifyContent="space-between" w="100%">
                        <Button rightIcon={<FaLocationArrow />} onClick={getGoogleMapsDir}>
                            <Text pr="2">{t('GET_DIR')}</Text>
                        </Button>
                        <IconButton
                            aria-label="favorite"
                            icon={isFav ? <BsHeartFill /> : <BsHeart />}
                            onClick={onFavHandle}
                        />
                    </Flex>
                </Box>
            </Box>
        </Drawer>
    );
};
