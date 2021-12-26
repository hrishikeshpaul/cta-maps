import React from 'react';

import { MapContainer } from './map/MapContainer';
import { Nav } from './nav/Nav';
import { RouteSelect } from './route-select/RouteSelect';
import { StoreProvider } from './store/Store';

import './App.scss';

export const App = () => {
    return (
        <div className="App">
            <StoreProvider>
                <Nav />
                <RouteSelect />
                <MapContainer />
            </StoreProvider>
        </div>
    );
};
