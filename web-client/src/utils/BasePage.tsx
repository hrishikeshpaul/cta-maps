import { FunctionComponent, ReactNode } from 'react';

import { Box, Flex, Button, useColorModeValue, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { HiArrowRight as ArrowRight } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

import { Info } from 'info/Info';

interface Props {
    children: ReactNode;
}

export const BasePage: FunctionComponent<Props> = ({ children }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Box>
            <Flex
                position="sticky"
                top="0"
                justifyContent="space-between"
                alignItems="center"
                mb="6"
                p="4"
                backgroundColor={useColorModeValue('white', 'gray.800')}
            >
                <Info disableAvatarShadow />
                <Button colorScheme="blue" rightIcon={<ArrowRight />} onClick={() => navigate('/')}>
                    {t('GO_TO_MAPS')}
                </Button>
            </Flex>
            <Box>{children}</Box>
            <Flex justifyContent="space-between" alignItems="center" boxShadow="sm" mt="12" p="4">
                <Text fontSize="xs" pt="1" color={useColorModeValue('gray.600', 'gray.200')}>
                    © {new Date().getFullYear()} trackCTA. All rights reserved.
                </Text>
            </Flex>
        </Box>
    );
};
