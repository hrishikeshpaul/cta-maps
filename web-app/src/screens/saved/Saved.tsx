import { FunctionComponent } from 'react';

import {
    Box,
    Flex,
    Divider,
    Text,
    useColorModeValue,
    Center,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Icon,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useDataStore } from 'store/data/DataStore';
import { CheckIcon, RightIcon } from 'utils/Icons';
import { SaveRouteIcon } from 'shared/save-icon/save-route-icon/SaveRouteIcon';
import { Route, RouteType } from 'store/data/DataStore.Types';
import { Screen } from 'shared/screen/Screen';
import { useSystemStore } from 'store/system/SystemStore';

export const Saved: FunctionComponent = () => {
    const { t } = useTranslation();
    const [{ savedStops, savedRoutes, routes }, { openStop, setRoute, removeRoute }] = useDataStore();
    const [
        {
            ui: { scrolledFromTop },
        },
    ] = useSystemStore();
    const bg = useColorModeValue('#ececec', '#4A5568');
    const TabBg = useColorModeValue('white', 'gray.800');


    const onToggleRoute = (route: Route) => {
        if (routes[route.route]) {
            removeRoute(route.route, route.type as RouteType);
        } else {
            setRoute(route);
        }
    };

    return (
        <Screen title="SAVED" pb="2">
            <Tabs isFitted my="4">
                <TabList
                    position="fixed"
                    top={!scrolledFromTop ? '102px' : '56px'}
                    w="100%"
                    zIndex={1}
                    backgroundColor={TabBg}
                    transition="top 0.2s ease-in-out"
                    left="50%"
                    transform="translate(-50%)"
                    maxW="container.sm"
                >
                    <Tab fontWeight="600">{t('STOPS')}</Tab>
                    <Tab fontWeight="600">{t('ROUTES')}</Tab>
                </TabList>
                <TabPanels p="0">
                    <TabPanel px="0">
                        {Object.values(savedStops).length === 0 && <Text px="4">{t('ADD_FAVORITES')}</Text>}
                        {Object.values(savedStops).map((favorite) => {
                            return (
                                <Box
                                    key={`fav-stops-${favorite.id}`}
                                    _active={{ bg }}
                                    onClick={() => openStop(favorite)}
                                >
                                    <Flex p="4" alignItems="center" justifyContent="space-between" overflow="hidden">
                                        <Text fontWeight="600" isTruncated>
                                            {favorite.name}
                                        </Text>
                                        <Box pl="2">
                                            <RightIcon />
                                        </Box>
                                    </Flex>
                                    <Divider />
                                </Box>
                            );
                        })}
                    </TabPanel>
                    <TabPanel px="0">
                        {Object.values(savedRoutes).length === 0 && <Text px="4">{t('ADD_FAVORITES')}</Text>}
                        {Object.values(savedRoutes).map(({ route, color, name, type }) => {
                            return (
                                <Box key={`fav-route-${route}`} _active={{ bg }}>
                                    <Flex justifyContent="center" alignItems="center" p="4">
                                        <Flex
                                            alignItems="center"
                                            overflow="hidden"
                                            w="100%"
                                            onClick={() => onToggleRoute({ route, color, name, type })}
                                        >
                                            <Center h="40px" w="40px" bg={color} borderRadius="md">
                                                <Text color="white" fontWeight="bold">
                                                    {route}
                                                </Text>
                                            </Center>
                                            <Text px="4" isTruncated fontWeight={500}>
                                                {name}
                                            </Text>
                                        </Flex>
                                        <Flex alignItems="center" pl="2">
                                            {routes[route] && (
                                                <Icon fontSize="2xl" mr="3">
                                                    <CheckIcon />
                                                </Icon>
                                            )}

                                            <SaveRouteIcon data={{ route, color, name, type }} />
                                        </Flex>
                                    </Flex>
                                    <Divider />
                                </Box>
                            );
                        })}
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Screen>
    );
};
