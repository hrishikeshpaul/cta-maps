'use strict';

import _ from 'lodash';

import { getVehicles, checkHeading } from './util.js';

const TIMER = 4000; //ms

class SocketConnection {
    constructor(socket) {
        this.routes = {};
        this.timer = null;
        this.socket = socket;
    }

    start_timer() {
        const that = this;

        this.timer = setInterval(async () => {
            try {
                const routeStr = Object.keys(this.routes).join(',');
                const data = await this.get_vehicles(routeStr);

                that.socket.emit('update-vehicles', data);
            } catch (err) {
                that.socket.emit('server-error');
            }
        }, TIMER);
    }

    stop_timer() {
        clearInterval(this.timer);
        this.timer = null;
    }

    async add(route) {
        try {
            const data = await this.get_vehicles(route);
            this.routes[route] = true;

            if (this.timer === null) {
                this.start_timer();
            }

            this.socket.emit('update-vehicles', data);
        } catch (err) {
            this.socket.emit('error', err);
        }
    }

    remove(route) {
        delete this.routes[route];

        if (Object.keys(this.routes).length === 0) {
            this.stop_timer();
        }
    }

    remove_all() {
        this.stop_timer();
        this.routes = {};
    }

    async get_vehicles(route) {
        let data = await getVehicles(route);
        data = data.map((item) => ({
            id: item.vid,
            timestamp: item.tmstmp,
            position: { lat: parseFloat(item.lat), lng: parseFloat(item.lon) },
            route: item.rt,
            destination: item.des,
            delayed: item.dly,
            heading: checkHeading(parseInt(item.hdg, 10)),
        }));

        return data;
    }
}

const connectedSockets = {};

const onRouteSelect = async (socket, route) => {
    connectedSockets[socket.id].add(route);
};

const onRouteDeselect = (socket, route) => {
    connectedSockets[socket.id].remove(route);
};

const onDisconnect = (socket) => {
    console.info('Socket disconnected -', socket.id);

    connectedSockets[socket.id].stop_timer();
    delete connectedSockets[socket.id];
};

const onRemoveAll = (socket) => {
    connectedSockets[socket.id].remove_all();
};

export const onConnection = (socket) => {
    connectedSockets[socket.id] = new SocketConnection(socket);

    console.info('Socket connected -', socket.id);

    socket.on('route-add', _.partial(onRouteSelect, socket));
    socket.on('route-remove', _.partial(onRouteDeselect, socket));
    socket.on('route-remove-all', _.partial(onRemoveAll, socket));
    socket.on('disconnect', _.partial(onDisconnect, socket));
};
