import { useToast } from '@chakra-ui/react';
import { FunctionComponent, useEffect } from 'react';
import { useDataStore } from 'store/data/DataStore';

import { socket } from 'utils/Socket';

export const SocketModule: FunctionComponent = () => {
    const [, { setVehicles, removeAllRoutes }] = useDataStore();
    const toast = useToast();

    useEffect(() => {
        if (socket) {
            socket.on('error', (error) => {
                toast.closeAll();
                toast({
                    description: error,
                    status: 'error',
                });
            });

            socket.on('disconnect', () => {
                toast.closeAll();
                toast({
                    description: 'Server disconnected. Reconnecting...',
                    status: 'error',
                });
                removeAllRoutes();
            });

            socket.on('connect', () => {
                toast.closeAll();
                toast({
                    description: 'Server connected!',
                    status: 'success',
                });
            });

            socket.on('update-vehicles', setVehicles);

            socket.on('server-error', () => {
                toast.closeAll();
                toast({
                    description: 'Server error. Please reselect routes.',
                    status: 'error',
                });
                removeAllRoutes();
            });

            return () => {
                socket.emit('disconnect').disconnect();
            };
        }
    }, [socket]); // eslint-disable-line
    return <></>;
};
