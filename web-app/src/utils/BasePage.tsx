import { FunctionComponent, ReactNode } from 'react';

import { Container, Text } from '@chakra-ui/react';

interface Props {
    title: string;
    children: ReactNode;
}

export const BasePage: FunctionComponent<Props> = ({ children, title }) => {
    return (
        <Container maxW="container.sm" p="0" py="4">
            <Text fontWeight="bold" fontSize="4xl" px="4">
                {title}
            </Text>
            {children}
        </Container>
    );
};
