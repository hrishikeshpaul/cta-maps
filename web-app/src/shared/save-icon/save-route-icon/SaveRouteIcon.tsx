import { FC, useEffect, useState } from 'react';

import { Button, IconButton } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { HeartFillIcon, HeartIcon } from 'utils/Icons';
import { useDataStore } from 'store/data/DataStore';
import { useSystemStore } from 'store/system/SystemStore';
import { Route } from 'store/data/DataStore.Types';
import { SaveIcon } from '../SaveIcon';

export enum ButtonMode {
    Full,
    Icon,
}

interface Props {
    mode?: ButtonMode;
    data: Route;
}

export const SaveRouteIcon: FC<Props> = ({ data: { route, name, color, type }, mode = ButtonMode.Icon }) => {
    const [{ savedRoutes }, { saveRoute, unSaveRoute }] = useDataStore();
    const [isFav, setIsFav] = useState<boolean>(false);

    useEffect(() => {
        if (savedRoutes[route]) {
            setIsFav(true);
        } else {
            setIsFav(false);
        }
    }, [savedRoutes]); // eslint-disable-line

    const onFavHandle = () => {
        if (savedRoutes[route]) {
            unSaveRoute(route);
        } else {
            saveRoute({ route, name, color, type });
        }
    };

    return <SaveIcon onClick={onFavHandle} isFav={isFav} mode={mode} />;
};
