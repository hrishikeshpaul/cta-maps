import { FunctionComponent, useEffect, useState } from 'react';

import { Container, Flex, Text, useColorModeValue, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useDataStore } from 'store/data/DataStore';
import { useSystemStore } from 'store/system/SystemStore';
import { HeartIcon, MapPinIcon, SearchIcon, SettingsIcon } from 'utils/Icons';

const navItems = [
    {
        icon: <MapPinIcon />,
        label: 'MAP',
        route: '/',
    },
    {
        icon: <SearchIcon />,
        label: 'SEARCH',
        route: '/search',
    },
    {
        icon: <HeartIcon />,
        label: 'SAVED',
        route: '/saved',
    },
    {
        icon: <SettingsIcon />,
        label: 'SETTINGS',
        route: '/settings',
    },
];

interface navItemProps {
    icon: JSX.Element;
    label: string;
    route: string;
}

export const Nav: FunctionComponent = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [{ routes }] = useDataStore();
    const [selected, setSelected] = useState<boolean>(false);
    const bg = useColorModeValue('gray.50', 'gray.900');

    useEffect(() => {
        setSelected(Object.keys(routes).length > 0);
    }, [routes]);

    const onRoute = (route: string) => {
        navigate(route);
    };

    const NavItem: FunctionComponent<navItemProps> = ({ icon, label, route }) => {
        return (
            <Stack
                borderTop="2px solid"
                color={window.location.pathname === route ? 'gray.50' : 'gray.400'}
                borderColor={window.location.pathname === route ? 'blue.200' : 'transparent'}
                width="100%"
                alignItems="center"
                p="2"
                spacing={1}
                cursor="pointer"
                transition="all 0.25s ease-in-out"
                onClick={() => onRoute(route)}
            >
                {icon}
                <Text fontSize="xs">{t(label)}</Text>
            </Stack>
        );
    };

    return (
        <Container
            maxW="container.sm"
            p="0"
            position="fixed"
            bottom="0"
            left="50%"
            transform="translate(-50%)"
            zIndex={100}
            bg={bg}
            boxShadow="xl"
        >
            <Flex justifyContent="space-between" alignItems="start" w="100%" transition="0.25s opacity ease-in-out">
                {navItems.map((item) => (
                    <NavItem {...item} key={item.route} />
                ))}
            </Flex>
        </Container>
    );
};
