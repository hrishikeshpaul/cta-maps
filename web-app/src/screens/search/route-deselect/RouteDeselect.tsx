import { FC, useEffect, useState } from 'react';

import { Button, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { RouteType } from 'store/data/DataStore.Types';
import { useDataStore } from 'store/data/DataStore';

interface Props {
    type?: RouteType;
}

const keys = Object.keys;
const values = Object.values;

export const RouteDeselect: FC<Props> = ({ type = RouteType.All }) => {
    const { t } = useTranslation();
    const [{ routes }, { removeAllRoutes }] = useDataStore();
    const [label, setLabel] = useState<string>(t('DESELECT_ALL'));
    const [count, setCount] = useState<number>(0);
    const deselectFontColor = useColorModeValue('blue.500', 'blue.200');

    useEffect(() => {
        switch (type) {
            case RouteType.All:
                setCount(keys(routes).length);
                setLabel(t('DESELECT_ALL'));
                break;
            case RouteType.Bus:
                setCount(keys(values(routes).filter((route) => route.type === RouteType.Bus)).length);
                setLabel(t('DESELECT_BUSSES'));
                break;
            case RouteType.Train:
                setCount(keys(values(routes).filter((route) => route.type === RouteType.Train)).length);
                setLabel(t('DESELECT_TRAINS'));
                break;
            default:
                throw Error(`Invalid type - ${type}`);
        }
    }, [routes, type, t]);

    return count > 0 ? (
        <Button variant="link" size="sm" color={deselectFontColor} onClick={() => removeAllRoutes(type)}>
            {label} {count > 0 && <>({count})</>}
        </Button>
    ) : null;
};
