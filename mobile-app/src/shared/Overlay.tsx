import { FunctionComponent, useState, useEffect } from 'react';

import { Box, PresenceTransition } from 'native-base';
import { useDataStore } from '../store/data/DataStore';
import { useSystemStore } from '../store/system/SystemStore';

export const Overlay: FunctionComponent = () => {
    const [{ routeSelectOpen }, { closeRouteSelect }] = useSystemStore();
    const [{ stop }, { closeStop }] = useDataStore();
    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
        if (routeSelectOpen || !!stop) {
            setShow(true);
        } else {
            setShow(false);
        }
    }, [routeSelectOpen, stop]);

    return (
        <PresenceTransition
            visible={show}
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 0.4,
                transition: {
                    duration: 250,
                },
            }}
            style={{
                position: 'absolute',
                top: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'black',
                zIndex: show ? 100 : 1,
            }}
        >
            <Box
                // ={() => {
                //     if (routeSelectOpen) closeRouteSelect();
                //     if (!!stop) closeStop();
                // }}
                w="100%"
                h="100%"
                bg="gray.900"
            />
        </PresenceTransition>
    );
};
