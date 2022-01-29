import { FunctionComponent, ReactNode, useEffect, useState, UIEvent } from 'react';

import { Box, Container, Flex, Text, useColorModeValue } from '@chakra-ui/react';

interface Props {
    header?: JSX.Element;
    headerIcon?: JSX.Element;
    constantPadding?: boolean;
    handleScroll?: (e: UIEvent<HTMLDivElement>) => void;
    title: string;
    children: ReactNode;
}

const navbarHeight = '54px';

export const BasePage: FunctionComponent<Props> = ({ children, title, headerIcon, header, constantPadding }) => {
    const bg = useColorModeValue('white', 'gray.800');
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
        <Container maxW="container.sm" p="0" pt={navbarHeight} position="relative">
            <Flex
                className="nav-bar"
                top={navbarHeight}
                maxW="inherit"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
                px="4"
                py={constantPadding ? '2' : scroll > 20 ? '2' : '6'}
                position="fixed"
                bg={scroll > 20 ? bg : 'transparent'}
                left="50%"
                transform="translate(-50%)"
                zIndex={100}
                transition="all 0.25s ease-in-out"
                boxShadow={scroll > 20 ? 'sm' : 'none'}
            >
                {header ? (
                    <>{header}</>
                ) : (
                    <>
                        <Text
                            fontWeight="bold"
                            fontSize="3xl"
                            transform={`scale(${headerSize})`}
                            transformOrigin="left"
                        >
                            {title}
                        </Text>
                        {headerIcon}
                    </>
                )}
            </Flex>
            <Box pt={constantPadding ? '72px' : '96px'}>{children}</Box>
        </Container>
    );
};
