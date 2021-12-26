import axios from 'axios';

import { Route } from './Store.Types';

const Http = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

export const getRoutes = async (): Promise<Route[]> => {
    // const { data } = await Http.get<Route[]>('/routes');

    // return data;

    const res = [
        {
            route: '1',
            name: 'Bronzeville/Union Station',
            color: '#336633',
        },
        {
            route: '2',
            name: 'Hyde Park Express',
            color: '#993366',
        },
        {
            route: '3',
            name: 'King Drive',
            color: '#009900',
        },
        {
            route: '4',
            name: 'Cottage Grove',
            color: '#cc3300',
        },
        {
            route: '5',
            name: 'South Shore Night Bus',
            color: '#996633',
        },
        {
            route: '6',
            name: 'Jackson Park Express',
            color: '#ff0066',
        },
        {
            route: '7',
            name: 'Harrison',
            color: '#666600',
        },
    ] as Route[];

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(res);
        }, 100);
    });
};
