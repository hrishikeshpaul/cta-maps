import { FC } from 'react';

import { Box, Flex, Switch, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useSystemStore } from 'store/system/SystemStore';
import { Screen } from 'shared/screen/Screen';
import { SettingsHeader } from 'screens/settings/settings-header/SettingsHeader';

export const GeneralLoadSavedRoutes: FC = () => {
    const { t } = useTranslation();
    const [{ settings }, { setShowActiveRoutes }] = useSystemStore();

    const onShowActiveRoutesChange = () => {
        if (settings.showActiveRoutes) {
            setShowActiveRoutes(false);
        } else {
            setShowActiveRoutes(true);
        }
    };

    return (
        <Screen header={<SettingsHeader title="ROUTES" />} constantPadding>
            <Box px="4">
                <Text fontSize="sm" opacity="0.6" mt="-4">
                    {t('ACTIVE_ROUTE_INFO')}
                </Text>
                <Flex justifyContent="space-between" alignItems="center" mt="4">
                    <Flex alignItems="center">
                        <Text pr="2">{t('SHOW_ACTIVE_ROUTES')}</Text>
                    </Flex>

                    <Switch size="lg" isChecked={settings.showActiveRoutes} onChange={onShowActiveRoutesChange} />
                </Flex>
            </Box>
        </Screen>
    );
};
