import socketClient from 'socket.io-client';
import { REACT_APP_BASE_URL } from '@env';

export const socket = socketClient(REACT_APP_BASE_URL, { transports: ['websocket'] });
