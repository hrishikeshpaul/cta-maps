import { FunctionComponent } from 'react';

import {
    Box,
    Switch,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    Text,
    IconButton,
    Flex,
    useColorMode,
} from '@chakra-ui/react';
import { IoIosClose } from 'react-icons/io';

import { useStore } from '../store/Store';
import { ColorMode } from '../store/Store.Types';

export const Settings: FunctionComponent = () => {
    const [{ settingsOpen, settings }, { closeSettings, setColorMode }] = useStore();
    const { toggleColorMode } = useColorMode();

    const onDarkModeToggle = () => {
        toggleColorMode();
        if (settings.colorMode === ColorMode.Light) {
            setColorMode(ColorMode.Dark);
        } else {
            setColorMode(ColorMode.Light);
        }
    };

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
                    <Box>
                        <Text fontWeight="bold" color="gray.400" fontSize="sm">
                            Appearance
                        </Text>
                        <Flex justifyContent="space-between" alignItems="center" mt="2">
                            <Text>Dark Mode</Text>
                            <Switch
                                size="lg"
                                isChecked={settings.colorMode !== ColorMode.Light}
                                onChange={onDarkModeToggle}
                            />
                        </Flex>
                    </Box>
                    <Box mt="8">
                        <Text fontWeight="bold" color="gray.400" fontSize="sm">
                            Language
                        </Text>
                        <Flex justifyContent="space-between" alignItems="center" mt="2">
                            Select Language
                        </Flex>
                    </Box>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};
