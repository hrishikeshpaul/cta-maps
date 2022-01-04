import { FunctionComponent, ReactNode } from 'react';

import { Container, Flex, Button, useColorModeValue, Text } from '@chakra-ui/react';
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
        <Container maxW="container.lg">
            <Flex
                zIndex={100}
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
            <Container maxW="container.lg">{children}</Container>
            <Flex
                justifyContent="space-between"
                alignItems="center"
                mt="12"
                p="4"
            >
                <Text fontSize="xs" pt="1">
                    © {new Date().getFullYear()} trackCTA. All rights reserved.
                </Text>
            </Flex>
        </Container>
    );
};
