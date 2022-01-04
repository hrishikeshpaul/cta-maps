import { FunctionComponent, useEffect, useState } from 'react';

import { Box } from '@chakra-ui/react';

import { useDataStore } from 'store/data/DataStore';
import { useSystemStore } from 'store/system/SystemStore';

export const Overlay: FunctionComponent = () => {
    const [{ routeSelectOpen }] = useSystemStore();
    const [{ stop }] = useDataStore();
    const [show, setShow] = useState<boolean>(false);
    const [opShow, setOpShow] = useState<boolean>(false);

    useEffect(() => {
        setOpShow(routeSelectOpen || !!stop);

        if (routeSelectOpen || !!stop) {
            setShow(true);
        } else {
            setTimeout(() => {
                setShow(false);
            }, 150);
        }
    }, [routeSelectOpen, stop]);

    return (
        <Box
            w="100%"
            h="100%"
            bg="gray.900"
            opacity={opShow ? '0.5' : '0'}
            transition="opacity 0.2s ease-in-out"
            position="fixed"
            zIndex={show ? 100 : 1}
        />
    );
};
