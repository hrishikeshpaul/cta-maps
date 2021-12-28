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
} from '@chakra-ui/react';
import { IoIosClose } from 'react-icons/io';

import { useStore } from '../store/Store';

export const Settings: FunctionComponent = () => {
    const [{ settingsOpen }, { closeSettings }] = useStore();

    return (
        <Drawer isOpen={settingsOpen} placement="right" size="md" onClose={closeSettings} autoFocus={false}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader px="4">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text>Settings</Text>
                        <IconButton
                            variant="ghost"
                            fontSize="3xl"
                            aria-label="close"
                            mr="-3"
                            onClick={closeSettings}
                            icon={<IoIosClose />}
                        />
                    </Flex>
                </DrawerHeader>

                <DrawerBody px="4" pt="0">
                    Settings
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};
