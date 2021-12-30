import { FunctionComponent, useEffect, useState } from 'react';

import {
    Box,
    Switch,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    Text,
    IconButton,
    Flex,
    useColorMode,
    Radio,
    RadioGroup,
    Stack,
    Spinner,
    useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { IoIosClose } from 'react-icons/io';

import { useStore } from '../store/Store';
import { ColorMode, Status } from '../store/Store.Types';
import { Locale, LocaleLabels } from '../i18n/Config';
import { getAppStatus } from '../store/Service';

const StatusMapper = {
    [Status.Success]: 'green.300',
    [Status.InProgress]: 'orange.300',
    [Status.Failure]: 'red.300',
};

export const Settings: FunctionComponent = () => {
    const { i18n, t } = useTranslation();
    const [{ settingsOpen, settings }, { closeSettings, setColorMode, setLocale }] = useStore();
    const { toggleColorMode } = useColorMode();
    const [status, setStatus] = useState<{ web: string; server: string } | null>(null);

    useEffect(() => {
        if (settingsOpen) {
            (async () => {
                try {
                    const response = await getAppStatus();
                    setStatus({
                        web: response.web,
                        server: response.server,
                    });
                } catch (err) {}
            })();
        }
    }, [settingsOpen]);

    const onDarkModeToggle = () => {
        toggleColorMode();
        if (settings.colorMode === ColorMode.Light) {
            setColorMode(ColorMode.Dark);
        } else {
            setColorMode(ColorMode.Light);
        }
    };

    const onLocaleChange = (locale: string) => {
        i18n.changeLanguage(locale);
        setLocale(locale as Locale);
    };

    return (
        <Drawer isOpen={settingsOpen} placement="right" size="md" onClose={closeSettings} autoFocus={false}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader px="4">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text fontWeight="bold">{t('SETTINGS')}</Text>
                        <IconButton
                            variant="ghost"
                            fontSize="3xl"
                            aria-label="close"
                            mr="-3"
                            onClick={closeSettings}
                            icon={<IoIosClose />}
                        />
                    </Flex>
                </DrawerHeader>

                <DrawerBody px="4" pt="0">
                    <Box>
                        <Text fontWeight="bold" color="gray.400" fontSize="sm">
                            {t('APPEARANCE')}
                        </Text>
                        <Flex justifyContent="space-between" alignItems="center" mt="2">
                            <Text>{t('DARK_MODE')}</Text>
                            <Switch
                                size="lg"
                                isChecked={settings.colorMode !== ColorMode.Light}
                                onChange={onDarkModeToggle}
                            />
                        </Flex>
                    </Box>
                    <Box mt="8">
                        <Text fontWeight="bold" color="gray.400" fontSize="sm">
                            {t('LANGUAGE')}
                        </Text>
                        <Flex justifyContent="space-between" alignItems="center" mt="2">
                            <RadioGroup onChange={onLocaleChange} value={settings.locale}>
                                <Stack>
                                    {Object.keys(LocaleLabels).map((key: string) => (
                                        <Radio key={key} value={key}>
                                            <Text fontSize="md">{t(LocaleLabels[key as Locale])}</Text>
                                        </Radio>
                                    ))}
                                </Stack>
                            </RadioGroup>
                        </Flex>
                    </Box>
                    <Box mt="8">
                        <Text fontWeight="bold" color="gray.400" fontSize="sm">
                            {t('STATUS')}
                        </Text>
                        {status ? (
                            <>
                                <Flex justifyContent="space-between" alignItems="center" mt="2">
                                    <Text>{t('WEBSITE')}</Text>
                                    <Flex alignItems="center">
                                        <Box
                                            h="10px"
                                            w="10px"
                                            bg={StatusMapper[status.web as Status]}
                                            borderRadius="50%"
                                        />
                                        <Text pl="2" color="gray.400">
                                            Live
                                        </Text>
                                    </Flex>
                                </Flex>
                                <Flex justifyContent="space-between" alignItems="center" mt="2">
                                    <Text>{t('SERVER')}</Text>
                                    <Flex alignItems="center" borderRadius="50%">
                                        <Box
                                            h="10px"
                                            w="10px"
                                            bg={StatusMapper[status.server as Status]}
                                            borderRadius="50%"
                                        />
                                        <Text pl="2" color="gray.400">
                                            Live
                                        </Text>
                                    </Flex>
                                </Flex>{' '}
                            </>
                        ) : (
                            <Spinner size="sm" color="blue.400" />
                        )}
                    </Box>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};
