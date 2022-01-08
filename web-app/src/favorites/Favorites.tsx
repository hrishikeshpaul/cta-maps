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
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FiChevronRight } from 'react-icons/fi';
import { IoIosClose } from 'react-icons/io';

import { useSystemStore } from 'store/system/SystemStore';
import { useDataStore } from 'store/data/DataStore';

export const Favorites: FunctionComponent = () => {
    const { t } = useTranslation();
    const [{ favorites }, { openStop }] = useDataStore();
    const [{ favoritesOpen }, { closeFavorites }] = useSystemStore();
    const bg = useColorModeValue('#ececec', '#4A5568');

    return (
        <>
            <Drawer isOpen={favoritesOpen} placement="right" size="md" onClose={closeFavorites} autoFocus={false}>
                <DrawerOverlay />
                <DrawerContent>
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
                        {Object.values(favorites).map((favorite) => {
                            return (
                                <Box
                                    key={`fav-${favorite.id}`}
                                    _active={{ bg }}
                                    onClick={() => {
                                        openStop(favorite);
                                    }}
                                >
                                    <Flex p="4" alignItems="center" justifyContent="space-between" overflow="hidden">
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
                    </DrawerBody>

                    <DrawerFooter></DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};
