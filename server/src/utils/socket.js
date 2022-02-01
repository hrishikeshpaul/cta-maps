'use strict';

const _ = require('lodash');
const { socketLogger: log } = require('../utils/logger');

const { getVehicles } = require('../tc-app/bus/bus-service');

const TIMER = 3000; //ms

const Events = {
    Connection: 'connection',
    RouteAdd: 'route-add',
    RouteRemove: 'route-remove',
    RouteRemoveAll: 'route-remove-all',
    Idle: 'idle',
    Active: 'active',
    Disconnect: 'disconnect',
    UpdateVehicles: 'update-vehicles',
    ServerError: 'server-error',
    Error: 'error',
};

const TypeMapper = {
    B: 'bus',
    T: 'train',
};

class SocketConnection {
    constructor(socket) {
        this.routes = {
            bus: {},
            train: {},
        };
        this.timer = null;
        this.socket = socket;
        this.idleTimer = null;
    }

    start_timer() {
        const that = this;

        this.timer = setInterval(async () => {
            try {
                const routeStr = Object.keys(that.routes.bus).join(',');
                const data = await that.get_vehicles(routeStr, null);

                that.socket.emit(Events.UpdateVehicles, data);
            } catch (err) {
                console.log(err);
                that.socket.emit(Events.ServerError);
                log(Events.ServerError, JSON.stringify(err));
            }
        }, TIMER);
    }

    stop_timer() {
        clearInterval(this.timer);
        this.timer = null;
    }

    async add(routeObj) {
        try {
            switch (routeObj.type) {
                case 'B':
                    const data = await this.get_vehicles(routeObj.route, routeObj.color);
                    this.routes.bus[routeObj.route] = routeObj;

                    if (this.timer === null) {
                        this.start_timer();
                    }

                    this.socket.emit(Events.UpdateVehicles, data);
                    break;
                case 'T':
                    console.log(routeObj);
                    break;
                default:
                    throw Error(`Invalid type - ${routeObj.type}`);
            }
        } catch (err) {
            this.socket.emit(Events.Error, err);
            log(Events.ServerError, JSON.stringify(err));
        }
    }

    remove(route, type) {
        if (this.routes[TypeMapper[type]][route]) {
            delete this.routes[TypeMapper[type]][route];
        }

        if (Object.keys(this.routes.bus).length === 0 && Object.keys(this.routes.train).length === 0) {
            this.stop_timer();
        }
    }

    remove_all() {
        this.stop_timer();
        this.routes = {
            bus: {},
            train: {},
        };
    }

    async get_vehicles(routes, color) {
        let data = await getVehicles(routes);

        data = data.map((item) => ({
            id: item.vid,
            timestamp: item.tmstmp,
            position: {
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon),
                latitude: parseFloat(item.lat),
                longitude: parseFloat(item.lon),
            },
            route: item.rt,
            destination: item.des,
            delayed: item.dly,
            heading: parseInt(item.hdg, 10),
            color: color || this.routes.bus[item.rt].color,
            type: 'B',
        }));

        return data;
    }
}

const connectedSockets = {};

const onRouteSelect = async (socket, route) => {
    log(Events.RouteAdd, JSON.stringify(route));

    connectedSockets[socket.id].add(route);
};

const onRouteDeselect = (socket, route) => {
    log(Events.RouteRemove, route.route);

    connectedSockets[socket.id].remove(route.route, route.type);
};

const onDisconnect = (socket) => {
    log(Events.Disconnect, socket.id);

    connectedSockets[socket.id].stop_timer();
    delete connectedSockets[socket.id];
};

const onRemoveAll = (socket) => {
    log(Events.RouteRemoveAll, socket.id);

    connectedSockets[socket.id].remove_all();
};

const onIdle = (socket) => {
    log(Events.Idle, socket.id);

    connectedSockets[socket.id].stop_timer();
};

const onActive = (socket) => {
    log(Events.Active, socket.id);

    const connection = connectedSockets[socket.id];

    if (connection && Object.keys(connection.routes).length) {
        connectedSockets[socket.id].start_timer();
    }
};

const onConnection = (socket) => {
    log(Events.Connection, socket.id);

    connectedSockets[socket.id] = new SocketConnection(socket);

    socket.on(Events.RouteAdd, _.partial(onRouteSelect, socket));
    socket.on(Events.RouteRemove, _.partial(onRouteDeselect, socket));
    socket.on(Events.RouteRemoveAll, _.partial(onRemoveAll, socket));
    socket.on(Events.Idle, _.partial(onIdle, socket));
    socket.on(Events.Active, _.partial(onActive, socket));
    socket.on(Events.Disconnect, _.partial(onDisconnect, socket));
};

module.exports = {
    onConnection,
};
