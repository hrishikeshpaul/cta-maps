import axios from 'axios';

import { Pattern, Prediction, Route, Vehicle } from './Store.Types';

const Http = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

export const getRoutes = async (): Promise<Route[]> => {
    return new Promise((resolve) => {
        setTimeout(async () => {
            const { data } = await Http.get<Route[]>('/routes');

            resolve(data);
        }, 800);
    });
};

export const getPattern = async (route: string, color: string): Promise<Pattern[]> => {
    const { data } = await Http.get<Pattern[]>('/patterns', {
        params: {
            route,
            color,
        },
    });

    return data;
};

export const getVehicles = async (rt: string[]): Promise<Vehicle[]> => {
    const { data } = await Http.get<Vehicle[]>('/vehicles', {
        params: {
            rt: rt.join(','),
        },
    });

    return data;
};

export const getSingleVehicle = async (rt: string): Promise<Vehicle[]> => {
    const { data } = await Http.get<Vehicle[]>('/vehicles', {
        params: {
            rt,
        },
    });

    return data;
};

export const getPredictions = async (stop: string): Promise<Prediction[]> => {
    const { data } = await Http.get<Prediction[]>('/predictions', {
        params: {
            stop,
        },
    });

    return data;
};