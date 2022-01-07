import { FunctionComponent, useState } from 'react';

import { MaterialIcons } from '@expo/vector-icons';
import { Box, Button, IconButton, Text, useColorModeValue, Flex } from 'native-base';
import { useTranslation } from 'react-i18next';

import { LogoIcon } from '../../assets/logo/Logo';
import { useSystemStore } from '../store/system/SystemStore';
import { useDataStore } from '../store/data/DataStore';

export const Nav: FunctionComponent = () => {
    const { t } = useTranslation();
    const [{ routes }] = useDataStore();
    const [{ dragging }, { openRouteSelect, onLocationButtonPress }] = useSystemStore();
    const [selected, setSelected] = useState<boolean>(false);
    const buttonBg = useColorModeValue('white', 'gray.600');
    const buttonColor = useColorModeValue('black', 'white');

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexDirection="row"
            position="absolute"
            top="12"
            zIndex="99"
            w="100%"
            px="4"
        >
            <Box h="10" w="10" shadow="9">
                <LogoIcon />
            </Box>
            <Button
                shadow="9"
                borderRadius="xl"
                bg={buttonBg}
                color={buttonColor}
                size="lg"
                _pressed={{ bg: 'gray.200' }}
                onPress={() => openRouteSelect()}
                flexDirection="column"
            >
                <Text px="6" py="1" fontWeight="bold">
                    Routes
                </Text>
                {selected && (
                    <Flex flexWrap="wrap" mt="1" direction="row">
                        {routes.map((route) => (
                            <Box h="12px" w="15px" bg={route.color} mx="1" borderRadius="sm" key={route.route} />
                        ))}
                    </Flex>
                )}
            </Button>
            <IconButton
                shadow="9"
                borderRadius="xl"
                bg="white"
                icon={<MaterialIcons name="my-location" size={24} color="black" />}
                onPress={() => onLocationButtonPress(true)}
            ></IconButton>
        </Box>
    );
};
