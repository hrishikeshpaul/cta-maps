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
import { FaLocationArrow } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';

import { useDataStore } from 'store/data/DataStore';
import { getPredictions } from 'store/data/DataService';
import { Juncture, Prediction } from 'store/data/DataStore.Types';
import { Drawer } from 'components/Drawer';

export const Stop: FunctionComponent = () => {
    const { t } = useTranslation();
    const [{ stop }, { closeStop }] = useDataStore();
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [routes, setRoutes] = useState<string[]>([]);
    const [filter, setFilter] = useState<Record<string, boolean>>({});
    const toast = useToast();
    const JunctureMapper = {
        [Juncture.A]: (time: number) => (time < 2 ? t('ARRIVE_SHORTLY') : `${t('ARRIVE')} ${time} mins`),
        [Juncture.D]: (time: number) => (time < 2 ? t('DEPART_SHORTLY') : `${t('DEPART')} ${time} mins`),
    };
    const bg = useColorModeValue('white', 'gray.700');

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
            <Box p="4">
                <Flex justifyContent="space-between" alignItems="center" overflow="hidden">
                    <Text fontSize="xl" isTruncated fontWeight="bold">
                        {stop?.name}
                    </Text>
                    <Flex>
                        <IconButton
                            variant="ghost"
                            fontSize="2xl"
                            aria-label="close"
                            onClick={() => {
                                closeStop();
                                setFilter({});
                            }}
                            icon={<FiChevronDown />}
                        />
                    </Flex>
                </Flex>
                <Flex py="2" overflowX="auto">
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
                <Box className="info" h="60vh" overflow="auto">
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
                <Box position="absolute" bottom="0" left="50%" transform="translate(-50%)" bg={bg} p="4">
                    <Button rightIcon={<FaLocationArrow />} onClick={getGoogleMapsDir}>
                        <Text pr="2">{t('GET_DIR')}</Text>
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
};
