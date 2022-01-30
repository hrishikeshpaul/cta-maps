import { FC } from 'react';

import { Flex, Text } from '@chakra-ui/react';
import { RightIcon } from 'utils/Icons';
import { useNavigate } from 'react-router-dom';

export enum SettingsListItemType {
    NoRoute,
    Route,
}

interface Props {
    label: string;
    route: string;
    value: string;
}

export const SettingsListItem: FC<Props> = (props) => {
    const navigate = useNavigate();

    const onNavigate = () => {
        navigate(props.route);
    };

    return (
        <Flex justifyContent="space-between" alignItems="center" onClick={onNavigate}>
            <Text>{props.label}</Text>
            <Flex alignItems="center">
                <Text opacity="0.6" pr="2">
                    {props.value}
                </Text>
                <RightIcon fontSize="22px" />
            </Flex>
        </Flex>
    );
};
