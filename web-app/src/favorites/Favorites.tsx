import { FunctionComponent } from 'react';

import {
    Box,
    Flex,
    Divider,
    IconButton,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    Text,
    useColorModeValue,
    Center,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FiChevronRight, FiTrash } from 'react-icons/fi';
import { IoIosClose } from 'react-icons/io';

import { useSystemStore } from 'store/system/SystemStore';
import { useDataStore } from 'store/data/DataStore';

export const Favorites: FunctionComponent = () => {
    const { t } = useTranslation();
    const [{ favoriteStops, favoriteRoutes }, { openStop, unSaveRoute }] = useDataStore();
    const [{ favoritesOpen }, { closeFavorites }] = useSystemStore();
    const bg = useColorModeValue('#ececec', '#4A5568');

    return (
        <>
            <Drawer
                isOpen={favoritesOpen}
                placement="right"
                size="md"
                onClose={closeFavorites}
                autoFocus={false}
                closeOnOverlayClick
                id="favoriteStops"
            >
                <DrawerOverlay onClick={closeFavorites} />
                <DrawerContent position="absolute">
                    <DrawerHeader px="4">
                        <Flex justifyContent="space-between" alignItems="center">
                            <Text fontWeight="bold" fontSize="2xl">
                                {t('FAVORITES')}
                            </Text>
                            <IconButton
                                variant="ghost"
                                fontSize="3xl"
                                aria-label="close"
                                mr="-3"
                                onClick={closeFavorites}
                                icon={<IoIosClose />}
                            />
                        </Flex>
                    </DrawerHeader>

                    <DrawerBody px="0" pt="0">
                        <Tabs isFitted>
                            <TabList mx="4">
                                <Tab fontWeight="600">{t('STOPS')}</Tab>
                                <Tab fontWeight="600">{t('ROUTES')}</Tab>
                            </TabList>
                            <TabPanels p="0">
                                <TabPanel px="0">
                                    {Object.values(favoriteStops).length === 0 && (
                                        <Text px="4">{t('ADD_FAVORITES')}</Text>
                                    )}
                                    {Object.values(favoriteStops).map((favorite) => {
                                        return (
                                            <Box
                                                key={`fav-stops-${favorite.id}`}
                                                _active={{ bg }}
                                                onClick={() => openStop(favorite)}
                                            >
                                                <Flex
                                                    p="4"
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    overflow="hidden"
                                                >
                                                    <Text fontWeight="600" isTruncated>
                                                        {favorite.name}
                                                    </Text>
                                                    <Box pl="2">
                                                        <FiChevronRight />
                                                    </Box>
                                                </Flex>
                                                <Divider />
                                            </Box>
                                        );
                                    })}
                                </TabPanel>
                                <TabPanel px="0">
                                    {Object.values(favoriteRoutes).length === 0 && (
                                        <Text px="4">{t('ADD_FAVORITES')}</Text>
                                    )}
                                    {Object.values(favoriteRoutes).map(({ route, color, name }) => {
                                        return (
                                            <Box key={`fav-route-${route}`} _active={{ bg }}>
                                                <Flex justifyContent="center" alignItems="center" p="4">
                                                    <Flex alignItems="center" overflow="hidden" w="100%">
                                                        <Center h="40px" w="40px" bg={color} borderRadius="md">
                                                            <Text color="white" fontWeight="bold">
                                                                {route}
                                                            </Text>
                                                        </Center>
                                                        <Text px="4" isTruncated fontWeight={500}>
                                                            {name}
                                                        </Text>
                                                    </Flex>
                                                    <IconButton
                                                        aria-label="delete"
                                                        icon={<FiTrash />}
                                                        onClick={() => unSaveRoute(route)}
                                                    />
                                                </Flex>
                                                <Divider />
                                            </Box>
                                        );
                                    })}
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </DrawerBody>

                    <DrawerFooter></DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};
