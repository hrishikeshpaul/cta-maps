import { FunctionComponent } from 'react';

import { Box, Flex, RadioGroup, useColorMode, Text, Stack, Radio, Switch } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { Locale } from 'i18n/LocaleProvider';
import { useSystemStore } from 'store/system/SystemStore';
import { ColorMode } from 'store/system/SystemStore.Types';
import { BasePage } from 'utils/BasePage';
import { GeneralLoadSavedRoutes } from 'screens/settings/properties/general-load-saved-routes/GeneralLoadSavedRoutes';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SettingsView } from './settings-view/SettingsView';
import { GeneralLanguage } from './properties/general-language/GeneralLanguage';

export const Settings: FunctionComponent = () => {
    const { i18n, t } = useTranslation();
    const [{ settings }, { setColorMode, setLocale, setShowActiveRoutes }] = useSystemStore();
    const { toggleColorMode } = useColorMode();

    const onDarkModeToggle = () => {
        toggleColorMode();
        if (settings.colorMode === ColorMode.Light) {
            setColorMode(ColorMode.Dark);
        } else {
            setColorMode(ColorMode.Light);
        }
    };

    return (
        <Routes>
            <Route index={true} element={<SettingsView />} />
            <Route path="language" element={<GeneralLanguage />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};
