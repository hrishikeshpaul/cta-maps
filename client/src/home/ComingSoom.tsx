import { FC } from 'react';

import { Box, Button, Container, Input, InputGroup, InputLeftElement, Text, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { MailIcon } from 'utils/Icons';

export const ComingSoon: FC = () => {
    const { t } = useTranslation();
    const bg = useColorModeValue('gray.100', 'gray.700');
    const inputBg = useColorModeValue('gray.200', 'gray.600');

    return (
        <Box bg={bg} py="16" textAlign="center">
            <Container maxW="container.lg">
                <Text fontWeight="900" fontSize={{ base: '3xl', md: '4xl' }}>
                    {t('COMING_SOON')}
                </Text>

                <InputGroup mt="8">
                    <InputLeftElement>
                        <MailIcon />
                    </InputLeftElement>
                    <Input
                        outline="none"
                        fontWeight="400"
                        placeholder={t('ENTER_EMAIL')}
                        bg={inputBg}
                        border="none"
                        _placeholder={{ color: 'gray.400' }}
                    />
                    <Button colorScheme="blue" ml="2">
                        {t('NOTIFY_ME')}
                    </Button>
                </InputGroup>
            </Container>
        </Box>
    );
};
