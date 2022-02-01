import { FC, useEffect, useState } from 'react';

import { useDataStore } from 'store/data/DataStore';
import { Route } from 'store/data/DataStore.Types';
import { SaveIcon } from 'shared/save-icon/SaveIcon';

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
