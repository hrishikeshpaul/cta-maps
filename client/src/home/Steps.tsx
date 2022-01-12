import { FC } from 'react';

import { Box, Container, Image, Stack, Text, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const steps = [
    {
        fileName: '1',
        title: 'VISIT_THE_APP',
    },
    {
        fileName: '2',
        title: 'SELECT_ROUTE',
    },
    {
        fileName: '3',
        title: 'TRACK_BUSSES',
    },
    {
        fileName: '4',
        title: 'CHECK_STOPS',
    },
];

export const Steps: FC = () => {
    const { t } = useTranslation();
    const { colorMode } = useColorMode();
    const bg = useColorModeValue('gray.100', 'gray.700');

    return (
        <Box bg={bg} w="100%" py="24">
            <Container maxW="container.lg" px={{ base: '4', md: '0' }}>
                <Box textAlign="center">
                    <Text fontSize={{ base: '3xl', md: '4xl' }} fontWeight="900">
                        {t('HOW_IT_WORKS')}
                    </Text>
                </Box>

                <Stack mt="24" spacing="16">
                    {steps.map((step) => (
                        <Box>
                            <Text fontSize="2xl" fontWeight="700" pt="2" lineHeight="1" textAlign="center">
                                {t(step.title)}
                            </Text>
                            <Image
                                boxShadow="xl"
                                borderRadius="xl"
                                w="100%"
                                src={`steps/${colorMode}/${step.fileName}.png`}
                                mt="8"
                            />
                        </Box>
                    ))}
                </Stack>
            </Container>
        </Box>
    );
};
