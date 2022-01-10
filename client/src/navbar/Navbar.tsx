import { FC } from 'react';

import {
    Avatar,
    Box,
    Button,
    Container,
    Flex,
    HStack,
    IconButton,
    Link,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Drawer } from 'drawer/Drawer';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, LanguageIcon, MoonIcon, SunIcon } from 'utils/Icons';
import { LocaleColorMode } from 'shared/LocaleColorMode';

export const Navbar: FC = () => {
    const { t } = useTranslation();
    const { colorMode, toggleColorMode } = useColorMode();
    const navigate = useNavigate();
    const bg = useColorModeValue('white', 'gray.800');

    const onStart = () => {
        window.open('https://app.trackcta.com', '_blank');
    };

    const onRoute = (path: string) => {
        navigate(path);
    };

    return (
        <Flex position="fixed" p="4" top="0" bg={bg} w="100%">
            <Container maxW="container.lg">
                <Flex justifyContent="space-between" alignItems="center">
                    <HStack alignItems="center" spacing={8} display={{ base: 'none', md: 'flex' }}>
                        <Avatar src="/logo.svg" h="40px" w="40px" cursor="pointer" onClick={() => onRoute('/')} />
                        <Link fontWeight="bold" pl="4" onClick={() => onRoute('/manual')}>
                            {t('MANUAL')}
                        </Link>
                        <Link fontWeight="bold" onClick={() => onRoute('/faq')}>
                            {t('FAQ')}
                        </Link>
                        <Link fontWeight="bold" onClick={() => onRoute('/contact')}>
                            {t('CONTACT')}
                        </Link>
                    </HStack>

                    <Box display={{ base: 'block', md: 'none' }}>
                        <Drawer />
                    </Box>

                    <HStack>
                        <LocaleColorMode display={{ base: 'none', md: 'flex' }} />
                        <Button colorScheme="blue" rightIcon={<ArrowRightIcon />} onClick={onStart}>
                            {t('START_TRACKING')}
                        </Button>
                    </HStack>
                </Flex>
            </Container>
        </Flex>
    );
};
