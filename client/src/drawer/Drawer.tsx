import { FC } from 'react';

import {
    Avatar,
    Text,
    Flex,
    Drawer as ChakraDrawer,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    useDisclosure,
    IconButton,
    HStack,
} from '@chakra-ui/react';
// import { useTranslation } from 'react-i18next';
import { IoIosClose } from 'react-icons/io';

import { LocaleColorMode } from 'shared/LocaleColorMode';

export const Drawer: FC = () => {
    // const { t } = useTranslation();
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Avatar src="logo.svg" h="40px" w="40px" cursor="pointer" onClick={onOpen} />
            <ChakraDrawer isOpen={isOpen} onClose={onClose} placement="left" size="lg">
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader px="4">
                        <Flex justifyContent="space-between" alignItems="center">
                            <Text fontWeight="bold" fontSize="2xl">
                                trackCTA
                            </Text>
                            <HStack>
                                <LocaleColorMode />
                                <IconButton
                                    variant="ghost"
                                    fontSize="3xl"
                                    aria-label="close"
                                    mr="-3"
                                    onClick={onClose}
                                    icon={<IoIosClose />}
                                />
                            </HStack>
                        </Flex>
                    </DrawerHeader>
                </DrawerContent>
            </ChakraDrawer>
        </>
    );
};
