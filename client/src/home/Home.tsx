import { FC } from 'react';

import { Box, Button, Center, Container, Heading, Icon, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { HiArrowRight as ArrowRight } from 'react-icons/hi';

export const Home: FC = () => {
    const { t } = useTranslation();

    const onStart = () => {
        window.open('https://app.trackcta.com', '_blank');
    };

    return (
        <Box w="100%" h="100%">
            <Container maxW="container.lg" w="100%" h="100%" px="4">
                <Center w="100%" h="100%" textAlign="center" flexDirection="column">
                    <Text fontSize={{ base: 'md', md: 'xl' }} color="gray.500" fontWeight="600">
                        Tired of endlessly waiting at your bus stop?
                    </Text>
                    <Heading fontSize={{ base: '5xl', md: '7xl' }} pt="4" lineHeight="1" fontWeight="800">
                        <Text as="span" color="blue.500">
                            Track
                        </Text>{' '}
                        and{' '}
                        <Text as="span" color="red.500">
                            Predict
                        </Text>{' '}
                        CTA busses in{' '}
                        <Text
                            as="span"
                            textDecoration="underline"
                            textDecorationThickness="5"
                            textDecorationColor="blue.500"
                        >
                            real time
                        </Text>
                        .
                    </Heading>
                    <Button
                        size="lg"
                        py={{ base: 6, md: 8 }}
                        px={{ base: 10, md: 14 }}
                        colorScheme="blue"
                        onClick={onStart}
                        mt="10"
                        alignItems="center"
                    >
                        <Text fontSize={{ base: 'xl', md: '2xl' }} lineHeight="1">
                            {t('START_TRACKING')}
                        </Text>
                    </Button>
                </Center>
            </Container>
        </Box>
    );
};
