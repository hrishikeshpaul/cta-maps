import { FC } from 'react';

import { Box, Container, Flex, Image, Text, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const steps = [
    {
        fileName: '1',
        title: 'Visit the app!',
    },
    {
        fileName: '2',
        title: 'Visit the app!',
    },
    {
        fileName: '3',
        title: 'Visit the app!',
    },
    {
        fileName: '4',
        title: 'Visit the app!',
    },
];

export const Steps: FC = () => {
    const { t } = useTranslation();
    const { colorMode } = useColorMode();
    const bg = useColorModeValue('gray.100', 'gray.700');

    return (
        <Box bg={bg} w="100%" py="24">
            <Container maxW="container.lg">
                <Box textAlign="center">
                    <Text fontSize={{ base: '3xl', md: '4xl' }} fontWeight="900">
                        {t('HOW_IT_WORKS')}
                    </Text>
                </Box>
                <Flex mt="16" justifyContent="space-between">
                    <Box>
                        <Text fontSize="3xl" fontWeight="900" opacity={0.5}>
                            1.
                        </Text>
                        <Text fontSize="2xl" fontWeight="700">
                            Visit the app
                        </Text>
                    </Box>
                    <Image boxShadow="xl" borderRadius="xl" w="50%" src={`steps/${colorMode}/1.png`} />
                </Flex>
            </Container>
        </Box>
    );
};
