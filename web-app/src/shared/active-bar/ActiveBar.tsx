import { FC } from 'react';

import { Badge, Box, Container, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import { useDataStore } from 'store/data/DataStore';
import { BusIcon } from 'utils/Icons';
import { useSystemStore } from 'store/system/SystemStore';

export const ActiveBar: FC = () => {
    const [{ routes }] = useDataStore();
    const [{ dragging }] = useSystemStore();
    const bg = useColorModeValue('gray.50', 'gray.900');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    return (
        <Container
            maxW="container.sm"
            position="absolute"
            top="0"
            left="50%"
            transform="translate(-50%)"
            zIndex={100}
            p="0"
            opacity={dragging ? 0.5 : 1}
        >
            <Box m="4" borderRadius="lg" bg={bg} boxShadow="md">
                <HStack overflowX="auto" p="2">
                    {Object.values(routes).map((route) => {
                        return (
                            <Badge p="2" borderRadius="lg" color="white" d="flex" alignItems="center" bg={route.color}>
                                <BusIcon />
                                <Text pl="1">{route.route}</Text>
                            </Badge>
                        );
                    })}
                </HStack>
            </Box>
        </Container>
    );
};
