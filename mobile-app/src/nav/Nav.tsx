import { FunctionComponent } from 'react';

import { MaterialIcons } from '@expo/vector-icons';
import { Box, Button, IconButton, Text } from 'native-base';

import { LogoIcon } from '../../assets/Logo';

export const Nav: FunctionComponent = () => {
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
            <Box h="10" w="10">
                <LogoIcon />
            </Box>
            <Button borderRadius="xl" colorScheme="blue" size="lg">
                <Text px="6" py="1" fontWeight="bold" color="white">
                    Routes
                </Text>
            </Button>
            <IconButton
                borderRadius="xl"
                bg="white"
                icon={<MaterialIcons name="my-location" size={24} color="black" />}
            ></IconButton>
        </Box>
    );
};
