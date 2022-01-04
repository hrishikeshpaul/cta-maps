import { FunctionComponent, ReactNode } from 'react';

import { Box, Flex, Button, Avatar, useColorModeValue, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { HiArrowRight as ArrowRight } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

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
                borderBottom={`1px solid ${useColorModeValue('gray.300', 'gray.100')} `}
                mb="6"
                p="4"
                backgroundColor={useColorModeValue('gray.100', 'gray.900')}
            >
                <Avatar h="40px" w="40px" src="logo.svg" size="md" />
                <Button colorScheme="blue" rightIcon={<ArrowRight />} onClick={() => navigate('/')}>
                    {t('GO_TO_MAPS')}
                </Button>
            </Flex>
            <Box>{children}</Box>
            <Flex justifyContent="space-between" alignItems="center" boxShadow="sm" mt="12" p="4">
                <Text fontSize="xs" pt="1" color={useColorModeValue('gray.600', 'gray.200')}>
                    © {new Date().getFullYear()} CTA Maps. All rights reserved.
                </Text>
            </Flex>
        </Box>
    );
};
