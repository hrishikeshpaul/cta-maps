import React, { FunctionComponent } from 'react';

import { Button, IconButton, Flex } from '@chakra-ui/react';
import { FiSettings, FiInfo } from 'react-icons/fi';

import { useStore } from '../store/Store';

export const Nav: FunctionComponent = () => {
    const [{ dragging }, { openRouteSelect }] = useStore();

    const onRouteSelect = () => {
        openRouteSelect();
    };

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
            <Button size="lg" bg="white" boxShadow="lg" onClick={onRouteSelect}>
                Select Routes
            </Button>
            <IconButton bg="white" aria-label="help-icon" icon={<FiSettings />} boxShadow="md" />
        </Flex>
    );
};
