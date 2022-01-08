import { FunctionComponent, useEffect, useState } from 'react';

import { Box, Button, Container, IconButton, Flex, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MdMyLocation } from 'react-icons/md';
import { BsHeart } from 'react-icons/bs';

import { Info } from 'info/Info';
import { useDataStore } from 'store/data/DataStore';
import { useSystemStore } from 'store/system/SystemStore';

export const Nav: FunctionComponent = () => {
    const { t } = useTranslation();
    const [{ routes }] = useDataStore();
    const [{ dragging }, { openRouteSelect, onLocationButtonPress }] = useSystemStore();
    const [selected, setSelected] = useState<boolean>(false);
    const buttonBg = useColorModeValue('white', 'gray.600');
    const buttonColor = useColorModeValue('black', 'white');

    const onRouteSelect = () => {
        openRouteSelect();
    };

    useEffect(() => {
        setSelected(routes.length > 0);
    }, [routes]);

    return (
        <Container
            maxW="container.lg"
            p="0"
            position="fixed"
            top="0"
            left="50%"
            transform="translate(-50%)"
            zIndex={100}
        >
            <Flex
                justifyContent="space-between"
                alignItems="start"
                w="100%"
                p="4"
                opacity={dragging ? '0.25' : '1'}
                transition="0.25s opacity ease-in-out"
            >
                <Info />
                <Button bg={buttonBg} boxShadow="lg" onClick={onRouteSelect} flexDir="column" px="12">
                    <Text fontSize={selected ? 'xs' : 'sm'} color={selected ? 'gray.400' : buttonColor}>
                        {t('ROUTES')}
                    </Text>
                    {selected && (
                        <Flex flexWrap="wrap" mt="1">
                            {routes.map((route) => (
                                <Box h="12px" w="15px" bg={route.color} mx="1" borderRadius="sm" key={route.route} />
                            ))}
                        </Flex>
                    )}
                </Button>
                <VStack spacing="4">
                    <IconButton
                        aria-label="my-favorites"
                        icon={<BsHeart />}
                        bg={buttonBg}
                        boxShadow="lg"
                        onClick={() => onLocationButtonPress(true)}
                    />
                    <IconButton
                        aria-label="my-location"
                        icon={<MdMyLocation />}
                        bg={buttonBg}
                        boxShadow="lg"
                        onClick={() => onLocationButtonPress(true)}
                    />
                </VStack>
            </Flex>
        </Container>
    );
};
