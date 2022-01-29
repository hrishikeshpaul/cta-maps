import { FunctionComponent, useMemo } from 'react';

import { Box, Text, Stack, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { Locale, LocaleLabels } from 'i18n/LocaleProvider';
import { Info } from 'screens/settings/info/Info';
import { SettingsListItem } from 'screens/settings/settings-list-item/SettingsListItem';
import { useSystemStore } from 'store/system/SystemStore';
import { SettingsMode } from 'store/system/SystemStore.Types';
import { BasePage } from 'utils/BasePage';

export const SettingsView: FunctionComponent = () => {
    const { t } = useTranslation();
    const activeBg = useColorModeValue('gray.100', 'gray.700');
    const [
        {
            settings: { locale, colorMode, showActiveRoutes },
        },
    ] = useSystemStore();

    const settingItems = useMemo(
        () => [
            {
                header: 'GENERAL',
                properties: [
                    {
                        key: 'settings-load-active-route',
                        Component: (
                            <SettingsListItem
                                value={
                                    showActiveRoutes
                                        ? t(SettingsMode.On.toUpperCase())
                                        : t(SettingsMode.Off.toUpperCase())
                                }
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
                                value={t(LocaleLabels[locale as Locale])}
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
                            <SettingsListItem
                                route="/settings/theme"
                                value={t(colorMode.toUpperCase())}
                                label={t('THEME')}
                            />
                        ),
                    },
                ],
            },
        ],
        [colorMode, locale, showActiveRoutes, t],
    );

    // const infoPages = useMemo(
    //     () => [
    //         {
    //             label: 'ABOUT',
    //         },
    //         {
    //             label: 'FAQ',
    //         },
    //         {
    //             label: 'CONTACT',
    //         },
    //         {
    //             label: 'SHARE',
    //         },
    //     ],
    //     [],
    // );

    return (
        <BasePage title="SETTINGS" headerIcon={<Info />}>
            <Stack spacing={8}>
                {settingItems.map((sItem) => (
                    <Box key={sItem.header}>
                        <Text fontWeight="bold" color="gray.400" fontSize="sm" px="4">
                            {t(sItem.header)}
                        </Text>
                        <Box mt="2">
                            {sItem.properties.map((prop) => (
                                <Box key={prop.key} py="2" px="4" _active={{ bg: activeBg }}>
                                    {prop.Component}
                                </Box>
                            ))}
                        </Box>
                    </Box>
                ))}
            </Stack>
        </BasePage>
    );
};
