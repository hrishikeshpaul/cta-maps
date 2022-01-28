import { FunctionComponent, ReactNode, useEffect, useState } from 'react';

import { Box, Container, Flex, Text, useColorModeValue } from '@chakra-ui/react';

interface Props {
    headerIcon?: JSX.Element;
    title: string;
    children: ReactNode;
}

export const BasePage: FunctionComponent<Props> = ({ children, title, headerIcon }) => {
    const bg = useColorModeValue('white', 'gray.900');
    const [scroll, setScroll] = useState<number>(0);
    const [headerSize, setHeaderSize] = useState<number>(1);

    useEffect(() => {
        document.addEventListener('scroll', (e) => {
            const scrolled = document.scrollingElement?.scrollTop;
            if (scrolled) {
                setScroll(scrolled);
                setHeaderSize(Math.max(0.6, 1 - 0.005 * scrolled));
            }
        });
    }, []);

    return (
        <Container maxW="container.sm" p="0" pb="56px" position="relative" overflow="auto">
            <Flex
                className="nav-bar"
                top="0"
                maxW="inherit"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
                px="4"
                py={scroll > 20 ? '2' : '6'}
                position="fixed"
                bg={scroll > 20 ? bg : 'transparent'}
                left="50%"
                transform="translate(-50%)"
                zIndex={100}
                transition="all 0.25s ease-in-out"
                boxShadow={scroll > 20 ? 'sm' : 'none'}
            >
                <Text fontWeight="bold" fontSize="3xl" transform={`scale(${headerSize})`} transformOrigin="left">
                    {title}
                </Text>
                {headerIcon}
            </Flex>
            <Box pt="96px">{children}</Box>
        </Container>
    );
};
