import { FunctionComponent } from 'react';

import { Container, Flex, Text, useColorModeValue, Stack, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { HeartIcon, MapPinIcon, SearchIcon, SettingsIcon } from 'utils/Icons';
import { useSystemStore } from 'store/system/SystemStore';

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
    const [{ dragging }] = useSystemStore();
    const bg = useColorModeValue('white', 'gray.800');
    const navItemActiveColor = useColorModeValue('gray.700', 'gray.50');
    const navItemInactiveColor = useColorModeValue('gray.400', 'gray.500');
    const navItemActiveBg = useColorModeValue('blue.100', 'blue.800');

    const onRoute = (route: string) => {
        navigate(route);
    };

    const getActive = (route: string) => {
        const [, parentRoute] = window.location.pathname.split('/');

        return `/${parentRoute}` === route;
    };

    const NavItem: FunctionComponent<navItemProps> = ({ icon, label, route }) => {
        return (
            <Stack
                bg={getActive(route) ? navItemActiveBg : 'transparent'}
                color={getActive(route) ? navItemActiveColor : navItemInactiveColor}
                width="100%"
                alignItems="center"
                p="2"
                spacing={1}
                cursor="pointer"
                transition="all 0.25s ease-in-out"
                onClick={() => onRoute(route)}
            >
                {icon}
                <Text fontSize="xs" fontWeight="600">
                    {t(label)}
                </Text>
            </Stack>
        );
    };

    return (
        <Box
            zIndex={1000}
            bg={bg}
            position="fixed"
            w="100%"
            top="0"
            boxShadow="sm"
            opacity={dragging ? '0.4' : 1}
            transition="opacity 0.25s ease-in-out"
        >
            <Container maxW="container.sm" p="0" w="100%" bg={bg}>
                <Flex justifyContent="space-between" alignItems="start" w="100%" transition="0.25s opacity ease-in-out">
                    {navItems.map((item) => (
                        <NavItem {...item} key={item.route} />
                    ))}
                </Flex>
            </Container>
        </Box>
    );
};
