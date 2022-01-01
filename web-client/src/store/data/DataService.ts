import axios from 'axios';

import { AppStatus, Pattern, Prediction, Route, Vehicle } from './DataStore.Types';

interface LocaleResponse {
    data: string;
    status: number;
}

const Http = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});
const { CancelToken } = axios;
let cancelVehiclesSource = CancelToken.source();
let cancelSingleVehicleSource = CancelToken.source();
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

export const getVehicles = async (rt: string[]): Promise<Vehicle[]> => {
    const { data } = await Http.get<Vehicle[]>('/vehicles', {
        params: {
            rt: rt.join(','),
        },
        cancelToken: cancelVehiclesSource.token,
    });

    return data;
};

export const cancelGetVehicles = (): void => {
    cancelVehiclesSource.cancel();
    cancelVehiclesSource = CancelToken.source();
};

export const getSingleVehicle = async (rt: string): Promise<Vehicle[]> => {
    const { data } = await Http.get<Vehicle[]>('/vehicles', {
        params: {
            rt,
        },
        cancelToken: cancelSingleVehicleSource.token,
    });

    return data;
};

export const cancelGetSingleVehicle = (): void => {
    cancelSingleVehicleSource.cancel();
    cancelSingleVehicleSource = CancelToken.source();
};

export const getPredictions = async (stop: string): Promise<Prediction[]> => {
    const { data } = await Http.get<Prediction[]>('/predictions', {
        params: {
            stop,
        },
    });

    return data;
};

export const getAppStatus = async (): Promise<AppStatus> => {
    const { data } = await Http.get<AppStatus>('/app-status');

    return data;
};

export const getLocaleJson = async (url: string): Promise<LocaleResponse> => {
    const { data, status } = await Http.get(url);

    return { data, status };
};
