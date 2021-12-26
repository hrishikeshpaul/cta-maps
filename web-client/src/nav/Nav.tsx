import React, { FunctionComponent, useEffect, useState } from 'react';

import { Box, Button, IconButton, Flex, Text } from '@chakra-ui/react';
import { FiSettings, FiInfo } from 'react-icons/fi';

import { useStore } from '../store/Store';

export const Nav: FunctionComponent = () => {
    const [{ dragging, routes }, { openRouteSelect }] = useStore();
    const [selected, setSelected] = useState<boolean>(false);

    const onRouteSelect = () => {
        openRouteSelect();
    };

    useEffect(() => {
        setSelected(routes.length > 0);
    }, [routes]);

    return (
        <Flex
            justifyContent="space-between"
            alignItems="center"
            w="100%"
            className="nav"
            p="4"
            opacity={dragging ? '0.25' : '1'}
            transition="0.25s opacity ease-in-out"
        >
            <IconButton bg="white" aria-label="help-icon" icon={<FiInfo />} boxShadow="md" />
            <Button size="lg" bg="white" boxShadow="lg" onClick={onRouteSelect} flexDir="column">
                <Text fontSize={selected ? 'xs' : 'md'}>{selected ? 'Selected Routes' : 'Select Routes'}</Text>
                {selected && (
                    <Flex flexWrap="wrap" mt="1">
                        {routes.map((route) => (
                            <Box h="12px" w="15px" bg={route.color} mx="1" borderRadius="sm" key={route.route} />
                        ))}
                    </Flex>
                )}
            </Button>
            <IconButton bg="white" aria-label="help-icon" icon={<FiSettings />} boxShadow="md" />
        </Flex>
    );
};
