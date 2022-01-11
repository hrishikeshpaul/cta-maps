import { FC } from 'react';

import { Box, Button, Container, Input, InputGroup, InputLeftElement, Text, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { MailIcon } from 'utils/Icons';

export const ComingSoon: FC = () => {
    const { t } = useTranslation();
    const bg = useColorModeValue('gray.100', 'gray.700');
    const inputBg = useColorModeValue('gray.200', 'gray.600');

    return (
        <Box bg={'red.500'} py="16" textAlign="center">
            <Container maxW="container.lg">
                <Text fontWeight="900" fontSize={{ base: '3xl', md: '4xl' }} color="white">
                    {t('COMING_SOON')}
                </Text>

                <InputGroup mt="8">
                    <InputLeftElement color="white">
                        <MailIcon />
                    </InputLeftElement>
                    <Input
                        outline="none"
                        fontWeight="400"
                        placeholder={t('ENTER_EMAIL')}
                        bg={'red.400'}
                        border="none"
                        _placeholder={{ color: 'red.100' }}
                    />
                    <Button colorScheme="blue" ml="2">
                        {t('NOTIFY_ME')}
                    </Button>
                </InputGroup>
            </Container>
        </Box>
    );
};
