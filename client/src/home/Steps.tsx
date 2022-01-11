import { FC } from 'react';

import { Avatar, Box, Container, Flex, Image, Link, Text, useColorMode, useColorModeValue } from '@chakra-ui/react';
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
            <Container maxW="container.lg" px={{ base: '4', md: '0' }}>
                <Box textAlign="center">
                    <Text fontSize={{ base: '3xl', md: 'xl' }} fontWeight="700">
                        {t('HOW_IT_WORKS')}
                    </Text>
                </Box>
                <Flex
                    position="relative"
                    mt="24"
                    justifyContent="flex-end"
                    alignItems="center"
                    direction={{ base: 'column', md: 'row' }}
                >
                    <Box position="absolute" top="10%" left="0">
                        <Avatar name="1" bg="blue.500" size="sm" />
                        <Text fontSize="6xl" fontWeight="700">
                            Visit the app
                        </Text>
                    </Box>
                    <Image
                        boxShadow="xl"
                        borderRadius="xl"
                        w={{ base: '100%', md: '75%' }}
                        src={`steps/${colorMode}/1.png`}
                    />
                </Flex>
                <Flex
                    position="relative"
                    mt="24"
                    justifyContent="flex-start"
                    alignItems="center"
                    direction={{ base: 'column', md: 'row' }}
                >
                    <Box position="absolute" top="10%" right="0">
                        <Avatar name="2" bg="blue.500" size="sm" />
                        <Text fontSize="6xl" fontWeight="700">
                            Select a route
                        </Text>
                    </Box>
                    <Image
                        boxShadow="xl"
                        borderRadius="xl"
                        w={{ base: '100%', md: '75%' }}
                        src={`steps/${colorMode}/2.png`}
                    />
                </Flex>
                <Flex
                    position="relative"
                    mt="24"
                    justifyContent="flex-end"
                    alignItems="center"
                    direction={{ base: 'column', md: 'row' }}
                >
                    <Box position="absolute" top="10%" left="0">
                        <Avatar name="3" bg="blue.500" size="sm" />
                        <Text fontSize="6xl" fontWeight="700">
                            Track the busses
                        </Text>
                    </Box>
                    <Image
                        boxShadow="xl"
                        borderRadius="xl"
                        w={{ base: '100%', md: '75%' }}
                        src={`steps/${colorMode}/3.png`}
                    />
                </Flex>
                <Flex
                    position="relative"
                    mt="24"
                    justifyContent="flex-start"
                    alignItems="center"
                    direction={{ base: 'column', md: 'row' }}
                >
                    <Box position="absolute" top="10%" right="0">
                        <Avatar name="2" bg="blue.500" size="sm" />
                        <Text fontSize="6xl" fontWeight="700">
                            Check stops
                        </Text>
                    </Box>
                    <Image
                        boxShadow="xl"
                        borderRadius="xl"
                        w={{ base: '100%', md: '75%' }}
                        src={`steps/${colorMode}/4.png`}
                    />
                </Flex>
            </Container>
        </Box>
    );
};
