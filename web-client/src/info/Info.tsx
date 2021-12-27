import React, { FunctionComponent } from 'react';

import {
    Avatar,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    Text,
    IconButton,
    Flex,
} from '@chakra-ui/react';
import { IoIosClose } from 'react-icons/io';

import { useStore } from '../store/Store';

export const Info: FunctionComponent = () => {
    const [{ infoOpen }, { closeInfo }] = useStore();
    return (
        <Drawer isOpen={infoOpen} placement="right" size="md" onClose={closeInfo} autoFocus={false}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader px="4">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text>Info</Text>
                        <IconButton
                            variant="ghost"
                            fontSize="3xl"
                            aria-label="close"
                            mr="-3"
                            onClick={closeInfo}
                            icon={<IoIosClose />}
                        />
                    </Flex>
                </DrawerHeader>

                <DrawerBody px="4" d="flex" flexDir="column" alignItems="center" pt="0">
                    <Avatar src="/logo.svg" size="xl" />
                    <Text fontSize="lg" fontWeight="bold" pt="2">
                        CTA Maps
                    </Text>
                    <Text color="gray.500" textAlign="center" fontSize="xs">
                        v1.0.0
                    </Text>
                    <Text color="gray.700" textAlign="center">
                        An application to track CTA busses, so that you are not waiting at the bus stop forever.
                    </Text>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};
