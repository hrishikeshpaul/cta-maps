import { FC } from 'react';

import { Flex, Text } from '@chakra-ui/react';
import { BasePage } from 'utils/BasePage';
import { SettingsHeader } from 'screens/settings/settings-header/SettingsHeader';

export const AppearanceTheme: FC = () => {
    return (
        <BasePage header={<SettingsHeader title="THEME" />}>
            <></>
        </BasePage>
        // <Flex justifyContent="space-between" alignItems="center" mt="2">
        //     <Text>{t('DARK_MODE')}</Text>
        //     <Switch size="lg" isChecked={settings.colorMode !== ColorMode.Light} onChange={onDarkModeToggle} />
        // </Flex>
    );
};
