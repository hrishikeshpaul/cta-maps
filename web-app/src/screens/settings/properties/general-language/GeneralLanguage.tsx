import { FC } from 'react';

import { Flex, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { SettingsHeader } from 'screens/settings/settings-header/SettingsHeader';
import { Screen } from 'shared/screen/Screen';
import { useSystemStore } from 'store/system/SystemStore';
import { Locale, LocaleLabels } from 'i18n/LocaleProvider';

export const GeneralLanguage: FC = () => {
    const { i18n, t } = useTranslation();
    const [{ settings }, { setLocale }] = useSystemStore();

    const onLocaleChange = (locale: string) => {
        i18n.changeLanguage(locale);
        setLocale(locale as Locale);
    };

    return (
        <Screen constantPadding header={<SettingsHeader title="LANGUAGE" />} px="4">
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
        </Screen>
    );
};
