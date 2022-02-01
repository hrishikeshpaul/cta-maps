import { FunctionComponent, ReactNode, useEffect, useState, UIEvent } from 'react';

import { Box, Container, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { NAVBAR_HEIGHT } from '../../utils/Constants';
import { useSystemStore } from 'store/system/SystemStore';

interface Props {
    header?: JSX.Element;
    headerIcon?: JSX.Element;
    constantPadding?: boolean;
    handleScroll?: (e: UIEvent<HTMLDivElement>) => void;
    px?: string;
    pb?: string;
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
    pb,
}) => {
    const { t } = useTranslation();
    const bg = useColorModeValue('white', 'gray.800');
    const [
        {
            ui: { scrolledFromTop },
        },
    ] = useSystemStore();

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
                py={constantPadding ? '2' : scrolledFromTop ? '2' : '6'}
                pb={pb}
                position="fixed"
                bg={bg}
                left="50%"
                transform="translate(-50%)"
                zIndex={100}
                transition="all 0.25s ease-in-out"
                boxShadow={scrolledFromTop ? 'xs' : 'none'}
            >
                {header ? (
                    <>{header}</>
                ) : (
                    <>
                        <Text
                            fontWeight="bold"
                            fontSize={scrolledFromTop ? '18px' : '36px'}
                            transition="all 0.25s ease-in-out"
                        >
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
