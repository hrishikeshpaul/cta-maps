import { FunctionComponent, useEffect } from 'react';

import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useDataStore } from 'store/data/DataStore';
import { socket } from 'utils/Socket';
import { onRouteSelect } from 'store/data/DataService';
import { RouteType } from 'store/data/DataStore.Types';

const values = Object.values;

export const SocketModule: FunctionComponent = () => {
    const { t } = useTranslation();
    const [{ routes }, { setVehicles }] = useDataStore();
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
            });

            socket.on('connect', () => {
                if (values(routes).length) {
                    values(routes).forEach(({ color, route, type }) => {
                        onRouteSelect(route, color, type as RouteType);
                    });
                }

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
            });
        }
    }, [socket, routes]); // eslint-disable-line

    return <></>;
};
