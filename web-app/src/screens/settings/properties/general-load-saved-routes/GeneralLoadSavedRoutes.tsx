import { FC } from 'react';

import { Flex, Switch, Text } from '@chakra-ui/react';
import { Help } from 'shared/help/Help';
import { useTranslation } from 'react-i18next';
import { useSystemStore } from 'store/system/SystemStore';

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
        <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
                <Text pr="2">{t('SHOW_ACTIVE_ROUTES')}</Text>
                <Help label={t('ACTIVE_ROUTE_INFO')} />
            </Flex>

            <Switch isChecked={settings.showActiveRoutes} onChange={onShowActiveRoutesChange} />
        </Flex>
    );
};
