import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';

import {
    Avatar,
    Box,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerFooter,
    Text,
    IconButton,
    Flex,
    Link,
    useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FiChevronRight } from 'react-icons/fi';
import { IoIosClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

import { useSystemStore } from 'store/system/SystemStore';
import { getVersion } from 'store/system/SystemService';

import 'info/Info.scss';

interface Props {
    disableAvatarShadow?: boolean;
}

export const Info: FunctionComponent<Props> = ({ disableAvatarShadow = false }) => {
    const navigate = useNavigate();
    const { t } = useTranslation('common');
    const [{ infoOpen }, { closeInfoDrawer, openInfoDrawer }] = useSystemStore();
    const [version, setVersion] = useState<string>('');
    const borderBottom = useColorModeValue('#ececec', '#4A5568');

    const onContribute = () => {
        window.open('https://github.com/hrishikeshpaul/cta-maps/', '_blank');
    };

    const onNavigate = useCallback(
        (path: string) => {
            closeInfoDrawer();
            navigate(path);
        },
        [closeInfoDrawer, navigate],
    );

    const items = useMemo(
        () => [
            {
                text: t('USAGE_MANUAL'),
                onClick: () => onNavigate('/manual'),
            },
            {
                text: t('FAQ'),
                onClick: () => onNavigate('/faq'),
            },
            {
                text: t('CONTACT'),
                onClick: () => onNavigate('/contact'),
            },
            {
                text: t('SETTINGS'),
                onClick: () => onNavigate('/settings'),
            },
        ],
        [t, onNavigate],
    );

    useEffect(() => {
        (async () => {
            try {
                const data = await getVersion();
                setVersion(data);
            } catch (err: any) {
                console.log(err.response);
            }
        })();
    }, []);

    return (
        <>
            <Avatar
                src="/logo.svg"
                size="sm"
                boxShadow={disableAvatarShadow ? 'none' : 'lg'}
                onClick={openInfoDrawer}
                h="40px"
                w="40px"
                cursor="pointer"
            />
            <Drawer isOpen={infoOpen} placement="left" size="md" onClose={closeInfoDrawer} autoFocus={false}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader px="4">
                        <Flex justifyContent="space-between" alignItems="center">
                            <Text fontWeight="bold">trackCTA</Text>
                            <IconButton
                                variant="ghost"
                                fontSize="3xl"
                                aria-label="close"
                                mr="-3"
                                onClick={closeInfoDrawer}
                                icon={<IoIosClose />}
                            />
                        </Flex>
                    </DrawerHeader>

                    <DrawerBody px="0" pt="0" className="info">
                        <Flex flexDir="column" alignItems="center" px="4">
                            <Avatar src="/logo.svg" size="xl" />
                            <Text color="gray.400" pt="2" textAlign="center" fontSize="xs">
                                {version}
                            </Text>
                            <Text
                                pt="1"
                                color={useColorModeValue('gray.600', 'gray.200')}
                                textAlign="center"
                                fontSize="sm"
                                fontWeight="medium"
                            >
                                {t('DESCRIPTION')}
                            </Text>
                        </Flex>
                        <Box mt="8" className="info-box">
                            {items.map((item) => {
                                return (
                                    <Flex
                                        p="4"
                                        py="6"
                                        borderBottom={`1px solid ${borderBottom}`}
                                        className="item"
                                        onClick={item.onClick}
                                        key={item.text}
                                        _hover={{ bg: borderBottom }}
                                    >
                                        <Text className="item-text">{item.text}</Text>
                                        <FiChevronRight />
                                    </Flex>
                                );
                            })}
                        </Box>
                    </DrawerBody>
                    <DrawerFooter justifyContent="flex-start" flexDir="column" px="4">
                        <Text fontSize="sm">
                            {t('CONTRIBUTE')}{' '}
                            <Link
                                fontWeight="bold"
                                color={useColorModeValue('blue.500', 'blue.200')}
                                onClick={onContribute}
                            >
                                {t('START_HERE')}
                            </Link>
                            .
                        </Text>
                        <Text fontSize="xs" pt="1" color={useColorModeValue('gray.600', 'gray.200')}>
                            © {new Date().getFullYear()} trackCTA. All rights reserved.
                        </Text>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};
