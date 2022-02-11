import socketClient from 'socket.io-client';

export const socket = socketClient(process.env.REACT_APP_BASE_URL!, {
    transports: ['websocket'],
});
