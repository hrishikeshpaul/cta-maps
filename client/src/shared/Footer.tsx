import { FC } from 'react';

import { Avatar, Box, Container, Divider, Flex, HStack, Link, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

const links = [
    {
        label: 'USAGE',
        route: '/manual',
    },
    {
        label: 'FAQ',
        route: '/faq',
    },
    {
        label: 'POLICY',
        route: '/terms',
    },
    {
        label: 'POLICY',
        route: '/policy',
    },
    {
        label: 'CONTRIBUTE',
        click: () => window.open('https://github.com/hrishikeshpaul/cta-maps/', '_blank'),
    },
    {
        label: 'STATUS',
        route: '/status',
    },
    {
        label: 'LANGUAGE',
    },
    {
        label: 'USAGE',
        route: '/manual',
    },
];
export const Footer: FC = () => {
    const { t } = useTranslation();
    const SectionTitle: FC<{ label: string }> = ({ label }) => {
        return (
            <Text fontSize="sm" fontWeight="700" opacity="0.6" pb="2">
                {t(label)}
            </Text>
        );
    };

    const SectionLink: FC<{ label: string; route?: string; onClick?: () => void }> = ({ label, route }) => {
        return (
            <Link fontSize="sm" fontWeight="500" color="blue.500" as={NavLink} to={route || ''}>
                {t(label)}
            </Link>
        );
    };
    return (
        <Box>
            <Container maxW="container.lg">
                <Flex justifyContent="space-between" py="8" alignItems="start">
                    <Box>
                        <Flex alignItems="center">
                            <Avatar src="logo.svg" size="sm" />
                            <Text fontWeight="700" pl="2">
                                trackCTA
                            </Text>
                        </Flex>
                        <Text fontSize="xs" pt="2" color={useColorModeValue('gray.600', 'gray.200')}>
                            © {new Date().getFullYear()} trackCTA. All rights reserved.
                        </Text>
                    </Box>
                    <HStack spacing="16">
                        <Flex direction="column" justifyContent="flex-start" textAlign="start">
                            <SectionTitle label="APPLICATION" />
                            <SectionLink label="GUIDE" route="/guide" />
                            <SectionLink label="FAQ" route="/faq" />
                            <SectionLink label="TERMS" route="/terms" />
                            <SectionLink label="POLICY" route="/policy" />
                        </Flex>
                        <Flex direction="column" justifyContent="flex-start" textAlign="start">
                            <SectionTitle label="HELP" />
                            <SectionLink label="CONTACT" route="/guide" />
                            <SectionLink label="CONTRIBUTE" />
                            <SectionLink label="STATUS" route="/status" />
                            <SectionLink label="LANGUAGE" />
                        </Flex>
                    </HStack>
                </Flex>
            </Container>
        </Box>
    );
};
