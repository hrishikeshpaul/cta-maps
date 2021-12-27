import React, { FunctionComponent, useEffect, useState } from 'react';

import {
    Center,
    Box,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerFooter,
    Text,
    IconButton,
    Flex,
    useToast,
    Spinner,
    Badge,
    Button,
    Divider,
} from '@chakra-ui/react';
import { IoIosClose } from 'react-icons/io';
import { GrDirections } from 'react-icons/gr';

import { useStore } from '../store/Store';
import { getPredictions } from '../store/Service';
import { Juncture, Prediction } from '../store/Store.Types';

const JunctureMapper = {
    [Juncture.A]: (time: number) => `Arrives in ${time} mins`,
    [Juncture.D]: (time: number) => `Departs in ${time} mins`,
};

export const Stop: FunctionComponent = () => {
    const [{ stop }, { closeStop }] = useStore();
    const toast = useToast();
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [routes, setRoutes] = useState<string[]>([]);
    const [filter, setFilter] = useState<Record<string, boolean>>({});

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
                toast({
                    description: err.response.data,
                    status: 'error',
                });
            }
        })();
    }, [stop]);

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

    const RenderPred: FunctionComponent<Prediction> = ({ route, id, type, time, delayed, timestamp }) => {
        const PredictionCard: FunctionComponent = () => (
            <>
                <Flex justifyContent="space-between" alignItems="center" py="4">
                    <Flex alignItems="center">
                        <Center h="30px" w="30px">
                            <Text fontWeight="bold">{route}</Text>
                        </Center>
                        <Box pl="2">
                            <Text>
                                {JunctureMapper[type](time)}
                                {delayed && (
                                    <Badge size="xs" colorScheme="orange" ml="2">
                                        Delayed
                                    </Badge>
                                )}
                            </Text>
                        </Box>
                    </Flex>
                    <Text fontWeight="semibold">{timestamp}</Text>
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
        <Drawer isOpen={!!stop} placement="bottom" isFullHeight onClose={closeStop} autoFocus={false}>
            <DrawerOverlay />
            <DrawerContent borderTopRadius="xl">
                <DrawerHeader pl="4" pr="0">
                    <Flex justifyContent="space-between" alignItems="center" overflow="hidden">
                        <Text isTruncated>{stop?.name}</Text>
                        <Flex>
                            <IconButton
                                variant="ghost"
                                fontSize="3xl"
                                aria-label="close"
                                onClick={closeStop}
                                icon={<IoIosClose />}
                            />
                        </Flex>
                    </Flex>
                </DrawerHeader>

                <DrawerBody px="4" pt="0" className="info">
                    {loading ? (
                        <Spinner />
                    ) : (
                        <Box>
                            {predictions.length ? (
                                <>
                                    <Flex py="2">
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
                                    {predictions.map((prediction) => (
                                        <RenderPred {...prediction} key={prediction.id} />
                                    ))}
                                </>
                            ) : (
                                <Text>No schedule available</Text>
                            )}
                        </Box>
                    )}
                </DrawerBody>
                <DrawerFooter justifyContent="center">
                    <Button rightIcon={<GrDirections />} onClick={getGoogleMapsDir}>
                        <Text pr="2">Get Directions</Text>
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};
