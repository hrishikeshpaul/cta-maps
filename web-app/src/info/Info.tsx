import { FunctionComponent, useEffect, useMemo, useState } from 'react';

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
    Badge,
    useToast,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useSystemStore } from 'store/system/SystemStore';
import { getVersion } from 'store/system/SystemService';
import { CloseIcon, RightIcon, MenuIcon, SettingsIcon } from 'utils/Icons';

import 'info/Info.scss';

interface Props {
    disableAvatarShadow?: boolean;
}

export const Info: FunctionComponent<Props> = ({ disableAvatarShadow = false }) => {
    const { t } = useTranslation('common');
    const [{ infoOpen }, { closeInfoDrawer, openInfoDrawer, openSettings }] = useSystemStore();
    const [version, setVersion] = useState<string>('');
    const toast = useToast();
    const borderBottom = useColorModeValue('#ececec', '#4A5568');
    const buttonBg = useColorModeValue('white', 'gray.600');

    const onContribute = () => {
        window.open('https://github.com/hrishikeshpaul/cta-maps/', '_blank');
    };

    const items = useMemo(
        () => [
            {
                text: t('FAQ'),
                onClick: () => window.open('https://trackcta.com/faq', '_blank'),
                comingSoon: false,
            },
            {
                text: t('CONTACT'),
                onClick: () => window.open('https://trackcta.com/contact', '_blank'),
            },
            {
                text: t('SHARE'),
                onClick: () => {
                    navigator.clipboard.writeText('https://app.trackcta.com/');
                    toast.close('clipboard');
                    toast({ description: t('COPIED_TO_CLP'), id: 'clipboard', status: 'success' });
                },
            },
            // {
            //     text: t('TERMS'),
            //     onClick: () => window.open('https://trackcta.com/terms', '_blank'),
            // },
            // {
            //     text: t('POLICY'),
            //     onClick: () => window.open('https://trackcta.com/policy', '_blank'),
            // },
        ],
        [t, toast],
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
            <IconButton
                aria-label="menu-icon"
                icon={<MenuIcon />}
                variant="ghost"
                bg={buttonBg}
                onClick={openInfoDrawer}
                fontSize={disableAvatarShadow ? 'xl' : 'md'}
                boxShadow={disableAvatarShadow ? 'none' : 'lg'}
            />
            <Drawer isOpen={infoOpen} placement="left" size="md" onClose={closeInfoDrawer} autoFocus={false}>
                <DrawerOverlay onClick={closeInfoDrawer} />
                <DrawerContent>
                    <DrawerHeader px="4">
                        <Flex justifyContent="space-between" alignItems="center">
                            <Text fontWeight="bold" fontSize="2xl">
                                trackCTA
                            </Text>
                            <Flex>
                                <IconButton
                                    variant="ghost"
                                    fontSize="xl"
                                    aria-label="close"
                                    mr="1"
                                    onClick={openSettings}
                                    icon={<SettingsIcon />}
                                />
                                <IconButton
                                    variant="ghost"
                                    fontSize="3xl"
                                    aria-label="close"
                                    mr="-3"
                                    onClick={closeInfoDrawer}
                                    icon={<CloseIcon />}
                                />
                            </Flex>
                        </Flex>
                    </DrawerHeader>

                    <DrawerBody px="0" pt="0" className="info">
                        <Flex flexDir="column" alignItems="center" px="4">
                            <Avatar src="/logo.svg" size="xl" ignoreFallback />
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
                                        <Text className="item-text">
                                            {item.text}
                                            {item.comingSoon && (
                                                <Badge ml="2" variant="subtle" colorScheme="orange">
                                                    Coming soon
                                                </Badge>
                                            )}
                                        </Text>
                                        <RightIcon />
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
