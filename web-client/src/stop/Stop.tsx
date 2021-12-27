import React, { FunctionComponent } from 'react';

import {
    Avatar,
    Box,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerFooter,
    Text,
    IconButton,
    Flex,
} from '@chakra-ui/react';
import { IoIosClose } from 'react-icons/io';

import { useStore } from '../store/Store';

export const Stop: FunctionComponent = () => {
    const [{ stop }, { closeStop }] = useStore();

    return (
        <Drawer isOpen={!!stop} placement="bottom" size="xl" onClose={closeStop} autoFocus={false}>
            <DrawerOverlay />
            <DrawerContent borderTopRadius="xl">
                <DrawerHeader px="4">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text>{stop?.name}</Text>
                        <IconButton
                            variant="ghost"
                            fontSize="3xl"
                            aria-label="close"
                            mr="-3"
                            onClick={closeStop}
                            icon={<IoIosClose />}
                        />
                    </Flex>
                </DrawerHeader>

                <DrawerBody px="4" pt="0" className="info">
                    {stop?.id} - {stop?.route}
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};
