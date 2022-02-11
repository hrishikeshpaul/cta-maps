import { FC } from 'react';

import { Flex, Switch, Text, useColorMode } from '@chakra-ui/react';
import { Screen } from 'shared/screen/Screen';
import { SettingsHeader } from 'screens/settings/settings-header/SettingsHeader';
import { useTranslation } from 'react-i18next';
import { useSystemStore } from 'store/system/SystemStore';
import { ColorMode } from 'store/system/SystemStore.Types';

export const AppearanceTheme: FC = () => {
    const { t } = useTranslation();
    const [
        {
            settings: { colorMode },
        },
        { setColorMode },
    ] = useSystemStore();
    const { toggleColorMode } = useColorMode();

    const onDarkModeToggle = () => {
        toggleColorMode();
        if (colorMode === ColorMode.Light) {
            setColorMode(ColorMode.Dark);
        } else {
            setColorMode(ColorMode.Light);
        }
    };

    return (
        <Screen header={<SettingsHeader title="THEME" />} constantPadding>
            <Flex justifyContent="space-between" alignItems="center" px="4">
                <Text>{t('DARK_MODE')}</Text>
                <Switch size="lg" isChecked={colorMode !== ColorMode.Light} onChange={onDarkModeToggle} />
            </Flex>
        </Screen>
    );
};
