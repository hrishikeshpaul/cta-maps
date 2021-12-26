import React, { FunctionComponent } from 'react';

import { Button, IconButton, Flex } from '@chakra-ui/react';
import { FiSettings, FiInfo } from 'react-icons/fi';

import { useStore } from '../store/Store';

export const Nav: FunctionComponent = () => {
    const [, { openRouteSelect }] = useStore();

    const onRouteSelect = () => {
        openRouteSelect();
    };

    return (
        <Flex justifyContent="space-between" alignItems="center" w="100%" className="nav" p="4">
            <IconButton bg="white" aria-label="help-icon" icon={<FiInfo />} boxShadow="md" />
            <Button size="lg" bg="white" boxShadow="lg" onClick={onRouteSelect}>
                Select Routes
            </Button>
            <IconButton bg="white" aria-label="help-icon" icon={<FiSettings />} boxShadow="md" />
        </Flex>
    );
};
