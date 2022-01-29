import { FC } from 'react';

import { Flex, Text } from '@chakra-ui/react';
import { RightIcon } from 'utils/Icons';
import { useNavigate } from 'react-router-dom';

interface Props {
    label: string;
    value: string;
    route: string;
}

export const SettingsListItem: FC<Props> = ({ label, value, route }) => {
    const navigate = useNavigate();

    return (
        <Flex justifyContent="space-between" alignItems="center" onClick={() => navigate(route)}>
            <Text>{label}</Text>
            <Flex alignItems="center">
                <Text opacity="0.6" pr="2">
                    {value}
                </Text>
                <RightIcon fontSize="22px" />
            </Flex>
        </Flex>
    );
};
