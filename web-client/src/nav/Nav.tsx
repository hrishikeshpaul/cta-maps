import { FunctionComponent, useEffect, useState } from 'react';

import { Avatar, Box, Button, IconButton, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FiSettings } from 'react-icons/fi';

import { useDataStore } from 'store/data/DataStore';
import { useSystemStore } from 'store/system/SystemStore';

export const Nav: FunctionComponent = () => {
    const { t } = useTranslation();
    const [{ routes }] = useDataStore();
    const [{ dragging }, { openInfoDrawer, openRouteSelect, openSettings }] = useSystemStore();
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
        <Flex
            justifyContent="space-between"
            alignItems="center"
            w="100%"
            className="nav"
            p="4"
            opacity={dragging ? '0.25' : '1'}
            transition="0.25s opacity ease-in-out"
        >
            <Avatar src="/logo.svg" size="sm" boxShadow="lg" onClick={openInfoDrawer} h="40px" w="40px" />
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
            <IconButton
                bg={buttonBg}
                aria-label="help-icon"
                icon={<FiSettings />}
                boxShadow="lg"
                onClick={openSettings}
            />
        </Flex>
    );
};
