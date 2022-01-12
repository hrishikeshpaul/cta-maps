import { FunctionComponent, ReactNode } from 'react';

import { Box, Container, Flex, Button, useColorModeValue, Text, Avatar, Divider, HStack, Link } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Info } from 'info/Info';
import { ArrowRightIcon } from 'utils/Icons';

interface Props {
    children: ReactNode;
}

export const BasePage: FunctionComponent<Props> = ({ children }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Container maxW="container.lg" p="0">
            <Flex
                zIndex={100}
                position="sticky"
                top="0"
                justifyContent="space-between"
                alignItems="center"
                mb="6"
                p="4"
                backgroundColor={useColorModeValue('white', 'gray.800')}
            >
                <HStack alignItems="center" spacing={8} display={{ base: 'none', md: 'flex' }}>
                    <Avatar src="/logo.svg" h="40px" w="40px" />
                    <Link fontWeight="bold" pl="4">
                        Usage
                    </Link>
                    <Link fontWeight="bold">Contact</Link>
                    <Link fontWeight="bold">Legal</Link>
                    <Link fontWeight="bold">Settings</Link>
                </HStack>

                <Box display={{ base: 'block', md: 'none' }}>
                    <Info disableAvatarShadow />
                </Box>

                <Button colorScheme="blue" rightIcon={<ArrowRightIcon />} onClick={() => navigate('/')}>
                    {t('START_TRACKING')}
                </Button>
            </Flex>
            <Container maxW="container.lg">{children}</Container>
            <Divider mt="12" />
            <Flex justifyContent="space-between" alignItems="center" p="4" flexDir={{ base: 'column', md: 'row' }}>
                <Flex alignItems="center">
                    <Avatar src="/logo.svg" size="sm" />
                    <Text pl="2" fontWeight={800}>
                        trackCTA
                    </Text>
                </Flex>
                <Text fontSize="xs" pt={{ base: '4', md: '0' }}>
                    © {new Date().getFullYear()} trackCTA. All rights reserved.
                </Text>
            </Flex>
        </Container>
    );
};
