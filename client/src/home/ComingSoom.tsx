import { FC } from 'react';

import { Box, Container, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const ComingSoon: FC = () => {
    const { t } = useTranslation();

    return (
        <Box py="24" textAlign="center">
            <Container maxW="container.lg">
                <Text fontWeight="900" fontSize={{ base: '3xl', md: '4xl' }} color="red.500">
                    {t('COMING_SOON')}
                </Text>
            </Container>
        </Box>
    );
};
