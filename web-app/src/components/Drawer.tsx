import { FunctionComponent, ReactNode } from 'react';

import { Box, Container, Slide, useColorModeValue } from '@chakra-ui/react';

interface Props {
    direction: 'bottom' | 'left' | 'right';
    open: boolean;
    children: ReactNode;
}

export const Drawer: FunctionComponent<Props> = ({ direction, open, children }) => {
    return (
        <Slide direction={direction} in={open} unmountOnExit style={{ zIndex: 1402 }}>
            <Container maxW="container.lg" px={{ base: '0', md: '4' }}>
                <Box
                    px={{ base: '0', md: '2' }}
                    bg={useColorModeValue('white', 'gray.700')}
                    borderTopRightRadius="xl"
                    borderTopLeftRadius="xl"
                    boxShadow="xl"
                >
                    {children}
                </Box>
            </Container>
        </Slide>
    );
};
