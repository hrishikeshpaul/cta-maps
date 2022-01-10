import { FC } from 'react';

import { Avatar, Box, Button, Container, Flex, HStack, Link, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { HiArrowRight as ArrowRight } from 'react-icons/hi';
import { Drawer } from 'drawer/Drawer';

export const Navbar: FC = () => {
    const { t } = useTranslation();
    const bg = useColorModeValue('white', 'gray.700');

    const onStart = () => {
        window.open('https://app.trackcta.com', '_blank');
    };

    return (
        <Flex position="fixed" p="4" top="0" bg={bg} w="100%">
            <Container maxW="container.lg">
                <Flex justifyContent="space-between" alignItems="center">
                    <HStack alignItems="center" spacing={8} display={{ base: 'none', md: 'flex' }}>
                        <Avatar src="/logo.svg" h="40px" w="40px" />
                        <Link fontWeight="bold" pl="4">
                            {t('USAGE')}
                        </Link>
                        <Link fontWeight="bold">{t('FAQ')}</Link>
                        <Link fontWeight="bold">{t('CONTACT')}</Link>
                    </HStack>

                    <Box display={{ base: 'block', md: 'none' }}>
                        <Drawer />
                    </Box>

                    <Button colorScheme="blue" rightIcon={<ArrowRight />} onClick={onStart}>
                        {t('START_TRACKING')}
                    </Button>
                </Flex>
            </Container>
        </Flex>
    );
};
