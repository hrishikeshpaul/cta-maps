import { io } from 'socket.io-client';

import { REACT_APP_BASE_URL } from '@env';

export const socket = io('https://b35f-2601-240-c501-ea70-b051-543b-304e-82f5.ngrok.io', {
    transports: ['websocket'],
});
