import { FC } from 'react';

import {
    Avatar,
    Box,
    Text,
    Flex,
    Drawer as ChakraDrawer,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    useDisclosure,
    IconButton,
    HStack,
    useColorModeValue,
    DrawerBody,
    Link,
} from '@chakra-ui/react';
import { IoIosClose } from 'react-icons/io';
import { useTranslation } from 'react-i18next';

import { LocaleColorMode } from 'shared/LocaleColorMode';
import { NavLink } from 'react-router-dom';

interface ItemProp {
    label: string;
    route?: string;
    onClick?: () => void;
}

const menu = [
    {
        label: 'HOME',
        route: '/',
    },
    {
        label: 'FAQ',
        route: '/faq',
    },
    {
        label: 'CONTACT',
        route: '/contact',
    },
    {
        label: 'TERMS',
        route: '/terms',
    },
    {
        label: 'POLICY',
        route: '/policy',
    },
    {
        label: 'STATUS',
        route: '/status',
    },
];

export const Drawer: FC = () => {
    const { t } = useTranslation();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const bg = useColorModeValue('#ececec', '#4A5568');

    const Item: FC<ItemProp> = ({ label, route, onClick }) => {
        return (
            <Box
                bg={window.location.pathname === route ? bg : 'transparent'}
                px="2"
                py="4"
                borderRadius="lg"
                onClick={() => {
                    onClose();
                    if (onClick) onClick();
                }}
            >
                <Link fontWeight="600" fontSize="lg" p="4" as={NavLink} to={route || ''}>
                    {t(label)}
                </Link>
            </Box>
        );
    };

    return (
        <>
            <Avatar src="logo.svg" h="40px" w="40px" cursor="pointer" onClick={onOpen} />
            <ChakraDrawer isOpen={isOpen} onClose={onClose} placement="left">
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
                    <DrawerBody px="4">
                        {menu.map((item) => (
                            <Item {...item} />
                        ))}
                    </DrawerBody>
                </DrawerContent>
            </ChakraDrawer>
        </>
    );
};
