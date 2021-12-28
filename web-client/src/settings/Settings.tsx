import { FunctionComponent } from 'react';

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
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { IoIosClose } from 'react-icons/io';

import { useStore } from '../store/Store';
import { ColorMode } from '../store/Store.Types';
import { Locale, LocaleLabels } from '../i18n/Config';

export const Settings: FunctionComponent = () => {
    const { i18n, t } = useTranslation();
    const [{ settingsOpen, settings }, { closeSettings, setColorMode, setLocale }] = useStore();
    const { toggleColorMode } = useColorMode();

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
                        <Text>{t('SETTINGS')}</Text>
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
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};
