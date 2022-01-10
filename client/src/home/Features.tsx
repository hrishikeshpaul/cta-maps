import { FC } from 'react';

import { Avatar, Box, Container, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { IconType } from 'react-icons/lib';

import { ActivityIcon, LanguageIcon, UserHeartIcon } from 'utils/Icons';

interface FeatureItem {
    Icon: IconType;
    title: string;
    details: string;
}

const features: FeatureItem[] = [
    {
        Icon: ActivityIcon,
        title: 'LIVE_TRACKING',
        details: 'LIVE_TRACKING_DETAILS',
    },
    {
        Icon: LanguageIcon,
        title: 'LOCALE',
        details: 'LOCALE_DETAILS',
    },
    {
        Icon: UserHeartIcon,
        title: 'PERSONAL',
        details: 'PERSONAL_DETAILS',
    },
];

export const Features: FC = () => {
    const { t } = useTranslation();
    const bg = useColorModeValue('gray.100', 'gray.700');
    const iconColor = useColorModeValue('gray.800', 'white');

    const Item: FC<FeatureItem> = ({ Icon, title, details }) => {
        return (
            <Box>
                <Avatar icon={<Icon fontSize="36px" />} bg="transparent" color={iconColor} />
                <Text fontSize="2xl" fontWeight="700" pt="4">
                    {t(title)}
                </Text>
                <Text pt="1">{t(details)}</Text>
            </Box>
        );
    };

    return (
        <Box bg={bg} w="100%" py="16">
            <Container maxW="container.lg">
                <Box textAlign="center">
                    <Text fontSize={{ base: '3xl', md: '4xl' }} fontWeight="900">
                        {t('WHY')}
                    </Text>
                    <Stack
                        mt="16"
                        direction={{ base: 'column', md: 'row' }}
                        justifyContent="space-between"
                        spacing={24}
                    >
                        {features.map((feature) => (
                            <Item {...feature} />
                        ))}
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
};
