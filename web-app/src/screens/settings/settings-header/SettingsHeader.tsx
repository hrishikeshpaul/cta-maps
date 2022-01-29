import { FC } from 'react';

import { Button, Flex, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';


import { BackButton } from 'shared/back-button/BackButton';

interface Props {
    title: string;
}

export const SettingsHeader: FC<Props> = ({ title }) => {
    const { t } = useTranslation();
    const navigate = useNavigate()

    return (
        <Flex w="100%" justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
                <BackButton parentRoute="/settings" />
                <Text fontWeight="600">{title}</Text>
            </Flex>
            <Button variant="link" colorScheme="blue" onClick={() => navigate('/settings')}>
                {t('DONE')}
            </Button>
        </Flex>
    );
};
