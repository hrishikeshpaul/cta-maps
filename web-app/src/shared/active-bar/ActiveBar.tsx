import { FC } from 'react';

import { Badge, Container, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import { useDataStore } from 'store/data/DataStore';
import { BusIcon } from 'utils/Icons';

export const ActiveBar: FC = () => {
    const [{ routes }] = useDataStore();
    const bg = useColorModeValue('gray.50', 'gray.900');

    return (
        <Container
            maxW="container.sm"
            p="3"
            position="absolute"
            top="0"
            left="50%"
            transform="translate(-50%)"
            zIndex={100}
            bg={bg}
            boxShadow="xl"
            className="hello"
            borderBottomLeftRadius="xl"
            borderBottomRightRadius="xl"
        >
            <HStack overflowX="auto">
                {Object.values(routes).map((route) => {
                    return (
                        <Badge d="flex" alignItems="center" bg={route.color}>
                            <BusIcon />
                            <Text pl="2">{route.route}</Text>
                        </Badge>
                    );
                })}
            </HStack>
        </Container>
    );
};
