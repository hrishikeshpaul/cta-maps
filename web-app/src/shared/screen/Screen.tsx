import { FunctionComponent, ReactNode, useEffect, useState, UIEvent } from 'react';

import { Box, Container, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { NAVBAR_HEIGHT } from '../../utils/Constants';

interface Props {
    header?: JSX.Element;
    headerIcon?: JSX.Element;
    constantPadding?: boolean;
    handleScroll?: (e: UIEvent<HTMLDivElement>) => void;
    px?: string;
    title?: string;
    children: ReactNode;
}

export const Screen: FunctionComponent<Props> = ({
    children,
    title,
    headerIcon,
    header,
    constantPadding,
    px = '0',
}) => {
    const { t } = useTranslation();
    const bg = useColorModeValue('white', 'gray.800');
    const [scroll, setScroll] = useState<number>(0);
    const [headerSize, setHeaderSize] = useState<number>(36);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            const scrolled = document.scrollingElement?.scrollTop;

            console.log(scrolled);
            if (scrolled !== undefined) {
                setScroll(scrolled);

                if (scrolled > 20) {
                    setHeaderSize(18);
                } else {
                    setHeaderSize(36);
                }
            }
        });
    }, []);

    return (
        <Container maxW="container.sm" p="0" pt={NAVBAR_HEIGHT} position="relative">
            <Flex
                className="nav-bar"
                top={NAVBAR_HEIGHT}
                maxW="inherit"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
                px="4"
                py={constantPadding ? '2' : scroll > 20 ? '2' : '6'}
                position="fixed"
                bg={bg}
                left="50%"
                transform="translate(-50%)"
                zIndex={100}
                transition="all 0.25s ease-in-out"
            >
                {header ? (
                    <>{header}</>
                ) : (
                    <>
                        <Text fontWeight="bold" fontSize={`${headerSize}px`} transition="all 0.25s ease-in-out">
                            {title && t(title)}
                        </Text>
                        {headerIcon}
                    </>
                )}
            </Flex>
            <Box pt={constantPadding ? '72px' : '96px'} px={px}>
                {children}
            </Box>
        </Container>
    );
};
