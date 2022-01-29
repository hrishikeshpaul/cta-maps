import { FC } from 'react';

import { Flex, Switch, Text, useColorMode } from '@chakra-ui/react';
import { BasePage } from 'utils/BasePage';
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
        <BasePage header={<SettingsHeader title="THEME" />} constantPadding>
            <Flex justifyContent="space-between" alignItems="center" px="4">
                <Text>{t('DARK_MODE')}</Text>
                <Switch isChecked={colorMode !== ColorMode.Light} onChange={onDarkModeToggle} />
            </Flex>
        </BasePage>
    );
};
