import React, { FunctionComponent } from 'react';

import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    Text,
    IconButton,
    Flex,
    Box,
    InputGroup,
    Input,
    InputLeftElement,
} from '@chakra-ui/react';
import { FiChevronDown, FiSearch } from 'react-icons/fi';

import { useStore } from '../store/Store';

export const RouteSelect: FunctionComponent = () => {
    const [{ routeSelectOpen }, { closeRouteSelect }] = useStore();
    return (
        <Drawer isOpen={routeSelectOpen} placement="bottom" isFullHeight onClose={() => closeRouteSelect()}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader px="4">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text>Select Routes</Text>
                        <IconButton
                            variant="ghost"
                            fontSize="2xl"
                            aria-label="close"
                            mr="-3"
                            onClick={closeRouteSelect}
                            icon={<FiChevronDown />}
                        />
                    </Flex>
                    <InputGroup mt="2">
                        <InputLeftElement pointerEvents="none" children={<FiSearch color="gray.300" />} />
                        <Input placeholder="Bus Number..." />
                    </InputGroup>
                </DrawerHeader>

                <DrawerBody px="4">
                    <Box>Results here</Box>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};
