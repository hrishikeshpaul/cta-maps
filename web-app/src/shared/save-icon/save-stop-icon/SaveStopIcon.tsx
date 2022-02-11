import { FC, useEffect, useState } from 'react';

import { useDataStore } from 'store/data/DataStore';
import { SaveIcon, SaveIconMode } from 'shared/save-icon/SaveIcon';

interface Props {
    mode?: SaveIconMode;
}

export const SaveStopIcon: FC<Props> = ({ mode = SaveIconMode.Icon }) => {
    const [{ savedStops, stop }, { saveStop, unSaveStop }] = useDataStore();
    const [isFav, setIsFav] = useState<boolean>(false);

    useEffect(() => {
        if (stop && savedStops[stop.id]) {
            setIsFav(true);
        } else {
            setIsFav(false);
        }
    }, [savedStops, stop]); // eslint-disable-line

    const onFavHandle = () => {
        if (stop && savedStops[stop.id]) {
            unSaveStop(stop!.id);
        } else {
            saveStop(stop!);
        }
    };

    return <SaveIcon onClick={onFavHandle} isFav={isFav} mode={mode} />;
};
