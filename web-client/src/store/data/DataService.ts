import axios from 'axios';

import { Pattern, Prediction, Route, Vehicle } from 'store/data/DataStore.Types';
import { Http } from 'utils/Http';
import { socket } from 'utils/Socket';

const { CancelToken } = axios;
let cancelGetPatternSource = CancelToken.source();

export const getRoutes = async (): Promise<Route[]> => {
    const { data } = await Http.get<Route[]>('/routes');

    return new Promise((resolve) => {
        setTimeout(async () => {
            resolve(data);
        }, 250);
    });
};

export const getPattern = async (route: string, color: string): Promise<Pattern[]> => {
    const { data } = await Http.get<Pattern[]>('/patterns', {
        params: {
            route,
            color,
        },
        cancelToken: cancelGetPatternSource.token,
    });

    return data;
};

export const cancelGetPattern = (): void => {
    cancelGetPatternSource.cancel();
    cancelGetPatternSource = CancelToken.source();
};

export const getPredictions = async (stop: string): Promise<Prediction[]> => {
    const { data } = await Http.get<Prediction[]>('/predictions', {
        params: {
            stop,
        },
    });

    return data;
};

export const onRouteSelect = (route: string): void => {
    socket.emit('route-add', route);
};

export const onRouteDeselect = (route: string): void => {
    socket.emit('route-remove', route);
};

export const onRouteRemoveAll = (): void => {
    socket.emit('route-remove-all');
};
