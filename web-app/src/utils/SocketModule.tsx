import { FunctionComponent, useEffect } from 'react';

import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useDataStore } from 'store/data/DataStore';
import { socket } from 'utils/Socket';

export const SocketModule: FunctionComponent = () => {
    const { t } = useTranslation();
    const [, { setVehicles, removeAllRoutes }] = useDataStore();
    const toast = useToast();

    useEffect(() => {
        if (socket) {
            socket.on('error', () => {
                toast.closeAll();
                toast({
                    description: t('GENERIC_ERROR'),
                    status: 'error',
                });
            });

            socket.on('disconnect', () => {
                toast.closeAll();
                toast({
                    description: t('SERVER_DISCONNECT'),
                    status: 'warning',
                    duration: null,
                    
                });
                removeAllRoutes();
            });

            socket.on('connect', () => {
                toast.closeAll();
                toast({
                    description: t('SERVER_CONNECT'),
                    status: 'success',
                });
            });

            socket.on('update-vehicles', setVehicles);

            socket.on('server-error', () => {
                toast.closeAll();
                toast({
                    description: t('SERVER_ERROR'),
                    status: 'error',
                });
                removeAllRoutes();
            });
        }
    }, [socket]); // eslint-disable-line

    return <></>;
};
