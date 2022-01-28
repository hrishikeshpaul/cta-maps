import { FunctionComponent } from 'react';

import { Container, Flex, Text, useColorModeValue, Stack, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

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
    const bg = useColorModeValue('gray.50', 'gray.900');
    const navItemActiveColor = useColorModeValue('gray.700', 'gray.50');
    const navItemInactiveColor = useColorModeValue('gray.500', 'gray.400');
    const navItemActiveBorderColor = useColorModeValue('blue.400', 'blue.200');

    const onRoute = (route: string) => {
        navigate(route);
    };

    const NavItem: FunctionComponent<navItemProps> = ({ icon, label, route }) => {
        return (
            <Stack
                borderTop="2px solid"
                color={window.location.pathname === route ? navItemActiveColor : navItemInactiveColor}
                borderColor={window.location.pathname === route ? navItemActiveBorderColor : 'transparent'}
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
        <Box zIndex={100} bg={bg} position="fixed" w="100%" bottom="0">
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
