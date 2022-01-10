import { FunctionComponent } from 'react';

import { Box, Heading, Flex, RadioGroup, useColorMode, Text, Stack, Radio, Switch } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { Locale, LocaleLabels } from 'i18n/LocaleProvider';
import { Help } from 'shared/help/Help';
import { useSystemStore } from 'store/system/SystemStore';
import { ColorMode } from 'store/system/SystemStore.Types';
import { BasePage } from 'utils/BasePage';

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

    const onLocaleChange = (locale: string) => {
        i18n.changeLanguage(locale);
        setLocale(locale as Locale);
    };

    const onShowActiveRoutesChange = () => {
        if (settings.showActiveRoutes) {
            setShowActiveRoutes(false);
        } else {
            setShowActiveRoutes(true);
        }
    };

    return (
        <BasePage>
            <Heading>{t('SETTINGS')}</Heading>
            <Box mt="8">
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
                    <Switch size="lg" isChecked={settings.colorMode !== ColorMode.Light} onChange={onDarkModeToggle} />
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
        </BasePage>
    );
};
