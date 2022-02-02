import { FunctionComponent, useEffect, useState } from 'react';

import { Box, Button, Flex, Spinner, Center, Text, useColorModeValue, Accordion } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { RouteOption, RouteExtended } from 'screens/search/route-select/RouteOption';
import { useDataStore } from 'store/data/DataStore';
import { useSystemStore } from 'store/system/SystemStore';
import { RouteType } from 'store/data/DataStore.Types';

interface Props {
    routes: RouteExtended[];
    onChange?: (idx: number[]) => void;
    expandedPanelIdx?: number[];
    type?: RouteType;
}

export const RouteSelect: FunctionComponent<Props> = ({ routes: routesAsProps, onChange, expandedPanelIdx, type }) => {
    const { t } = useTranslation();
    const [{ routes: currentRoutes }, { removeAllRoutes }] = useDataStore();
    const [{ routesLoading }] = useSystemStore();
    const [routes, setRoutes] = useState<RouteExtended[]>(routesAsProps);
    const deselectFontColor = useColorModeValue('blue.500', 'blue.200');

    useEffect(() => {
        setRoutes(routesAsProps);
    }, [routesAsProps]);

    useEffect(() => {
        if (Object.keys(currentRoutes).length === 0) {
            setRoutes((prevRoutes) => {
                const updatedRoutes: RouteExtended[] = [...prevRoutes];

                prevRoutes.forEach((route) => {
                    route.selected = false;
                });

                return updatedRoutes;
            });
        }
    }, [currentRoutes]);

    return (
        <>
            <Box pb="4">
                <Flex justifyContent="space-between" px="4" pb="2">
                    <Text fontSize="sm" fontWeight="600" opacity="0.7">
                        {t('ALL_ROUTES')}
                    </Text>
                    {Object.keys(currentRoutes).length > 0 && (
                        <Button variant="link" size="sm" color={deselectFontColor} onClick={removeAllRoutes}>
                            {t('DESELECT_ALL')} ({Object.keys(currentRoutes).length})
                        </Button>
                    )}
                </Flex>

                <Accordion index={expandedPanelIdx} allowMultiple w="100%" onChange={onChange}>
                    {routes.map((route) => (
                        <>
                            {type ? (
                                type === route.type && (
                                    <RouteOption
                                        onChange={setRoutes}
                                        routes={routes}
                                        currentRoute={route}
                                        key={route.route}
                                    />
                                )
                            ) : (
                                <RouteOption
                                    onChange={setRoutes}
                                    routes={routes}
                                    currentRoute={route}
                                    key={route.route}
                                />
                            )}
                        </>
                    ))}
                </Accordion>

                {routesLoading ? (
                    <Center>
                        <Spinner color="blue.500" />
                    </Center>
                ) : null}
            </Box>
        </>
    );
};
