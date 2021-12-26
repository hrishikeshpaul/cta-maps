import axios from 'axios';

import { MockPatternData, MockRoutesData } from './Mock';
import { Pattern, Route } from './Store.Types';

const Http = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

export const getRoutes = async (): Promise<Route[]> => {
    // const { data } = await Http.get<Route[]>('/routes');

    // return data;

    const res = MockRoutesData as Route[];

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(res);
        }, 100);
    });
};

export const getPattern = async (route: string, color: string): Promise<Pattern[]> => {
    // const { data } = await Http.get<Pattern[]>('/patterns', {
    //     params: {
    //         route,
    //         color
    //     },
    // });

    // return data;

    const res = MockPatternData as Pattern[];

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(res);
        }, 100);
    });
};
