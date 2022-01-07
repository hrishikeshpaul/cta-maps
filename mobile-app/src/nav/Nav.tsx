import { FunctionComponent } from 'react';

import { MaterialIcons } from '@expo/vector-icons';
import { Box, Button, IconButton, Text } from 'native-base';

import { LogoIcon } from '../../assets/Logo';
import { useSystemStore } from '../store/system/SystemStore';

export const Nav: FunctionComponent = () => {
    const [, { openRouteSelect }] = useSystemStore();
    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexDirection="row"
            position="absolute"
            top="12"
            zIndex="100"
            w="100%"
            px="4"
        >
            <Box h="10" w="10" shadow="9">
                <LogoIcon />
            </Box>
            <Button
                shadow="9"
                borderRadius="xl"
                bg="white"
                size="lg"
                _pressed={{ bg: 'gray.200' }}
                onPress={() => openRouteSelect()}
            >
                <Text px="6" py="1" fontWeight="bold">
                    Routes
                </Text>
            </Button>
            <IconButton
                shadow="9"
                borderRadius="xl"
                bg="white"
                icon={<MaterialIcons name="my-location" size={24} color="black" />}
            ></IconButton>
        </Box>
    );
};
