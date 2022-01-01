import { FunctionComponent, useEffect } from 'react';
import { useDataStore } from 'store/data/DataStore';

import { socket } from 'utils/Socket';

export const SocketModule: FunctionComponent = () => {
    const [, { setVehicles }] = useDataStore();
    useEffect(() => {
        if (socket) {
            socket.on('error', () => {
                console.log('connect error');
            });

            socket.on('update-vehicles', setVehicles);

            return () => {
                socket.emit('disconnect').disconnect();
            };
        }
    }, [socket]);
    return <></>;
};
