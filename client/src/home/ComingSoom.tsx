import { FC } from 'react';

import {
    Box,
    Button,
    Container,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightAddon,
    InputRightElement,
    Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MailIcon } from 'utils/Icons';

export const ComingSoon: FC = () => {
    const { t } = useTranslation();

    return (
        <Box bg="blue.500" py="16" textAlign="center">
            <Container maxW="container.lg">
                <Text fontWeight="900" fontSize={{ base: '2xl', md: '4xl' }}>
                    {t('COMING_SOON')}
                </Text>
                <InputGroup mt="16" color="white">
                    <InputLeftElement>
                        <MailIcon />
                    </InputLeftElement>
                    <Input
                        _focus={{ outline: '0', border: 'none' }}
                        outline="none"
                        fontWeight="500"
                        placeholder={t('ENTER_EMAIL')}
                        bg="blue.600"
                        border="none"
                        _placeholder={{ color: 'gray.300' }}
                    />
                    <Button colorScheme="red" bg="red.500" color="white" ml="2">
                        {t('NOTIFY_ME')}
                    </Button>
                </InputGroup>
            </Container>
        </Box>
    );
};
