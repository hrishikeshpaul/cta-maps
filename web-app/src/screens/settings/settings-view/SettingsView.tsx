import { FunctionComponent, useMemo } from 'react';

import { Box, Flex, RadioGroup, useColorMode, Text, Stack, Radio, Switch, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { Locale, LocaleLabels } from 'i18n/LocaleProvider';
import { useSystemStore } from 'store/system/SystemStore';
import { ColorMode, SettingsMode } from 'store/system/SystemStore.Types';
import { BasePage } from 'utils/BasePage';
import { SettingsListItem, SettingsListItemType } from '../settings-list-item/SettingsListItem';

export const SettingsView: FunctionComponent = () => {
    const { i18n, t } = useTranslation();
    const [{ settings }, { setColorMode, setLocale, setShowActiveRoutes }] = useSystemStore();
    const { toggleColorMode } = useColorMode();
    const activeBg = useColorModeValue('gray.100', 'gray.700');

    const onDarkModeToggle = () => {
        toggleColorMode();
        if (settings.colorMode === ColorMode.Light) {
            setColorMode(ColorMode.Dark);
        } else {
            setColorMode(ColorMode.Light);
        }
    };

    const settingItems = useMemo(
        () => [
            {
                header: 'GENERAL',
                properties: [
                    {
                        key: 'settings-load-active-route',
                        Component: (
                            <SettingsListItem
                                value={settings.showActiveRoutes ? SettingsMode.On : SettingsMode.Off}
                                label={t('SHOW_ACTIVE_ROUTES')}
                                route="/settings/routes"
                            />
                        ),
                    },
                    {
                        key: 'settings-language',
                        Component: (
                            <SettingsListItem
                                label={t('LANGUAGE')}
                                value={t(LocaleLabels[settings.locale as Locale])}
                                route="/settings/language"
                            />
                        ),
                    },
                ],
            },
            {
                header: 'APPEARANCE',
                properties: [
                    {
                        key: 'settings-theme',
                        Component: (
                            <SettingsListItem route="/settings/theme" value={settings.colorMode} label={t('THEME')} />
                        ),
                    },
                ],
            },
        ],
        [],
    );

    return (
        <BasePage title="SETTINGS">
            <Stack spacing={8}>
                {settingItems.map((sItem) => (
                    <Box key={sItem.header}>
                        <Text fontWeight="bold" color="gray.400" fontSize="sm" px="4">
                            {t(sItem.header)}
                        </Text>
                        <Box mt="3">
                            {sItem.properties.map((prop) => (
                                <Box key={prop.key} py="3" px="4" _active={{ bg: activeBg }}>
                                    {prop.Component}
                                </Box>
                            ))}
                        </Box>
                    </Box>
                ))}
                {/* <Box mt="4">
                    <Text fontWeight="bold" color="gray.400" fontSize="sm">
                        {t('ROUTES')}
                    </Text>
                    <Flex justifyContent="space-between" alignItems="center" mt="2">
                        <Flex alignItems="center">
                            <Text pr="2">{t('SHOW_ACTIVE_ROUTES')}</Text>
                            <Help label={t('ACTIVE_ROUTE_INFO')} />
                        </Flex>

                        <Switch size="lg" isChecked={settings.showActiveRoutes} onChange={onShowActiveRoutesChange} />
                    </Flex>
                </Box>

                <Box mt="8">
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

                    <Flex justifyContent="space-between" alignItems="center" mt="2">
                        <Text>{t('BUS_ICON')}</Text>
                        <BusIcon />
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
                </Box> */}
            </Stack>
        </BasePage>
    );
};
