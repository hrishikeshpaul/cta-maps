import { FunctionComponent, useEffect, useState } from 'react';

import { Box } from '@chakra-ui/react';

import { useSystemStore } from 'store/system/SystemStore';

export const Overlay: FunctionComponent = () => {
    const [{ routeSelectOpen }] = useSystemStore();
    const [show, setShow] = useState<boolean>(false);
    const [opShow, setOpShow] = useState<boolean>(false);

    useEffect(() => {
        setOpShow(routeSelectOpen);
        
        if (routeSelectOpen) {
            setShow(true);
        } else {
            setTimeout(() => {
                setShow(false);
            }, 150);
        }
    }, [routeSelectOpen]);

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
