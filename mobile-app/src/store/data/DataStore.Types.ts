export enum PointType {
    S = 'S', // stop
    W = 'W', // waypoint
}

export enum Direction {
    Northbound = 'Northbound',
    Southbound = 'Southbound',
    Eastbound = 'Eastbound',
    Westbound = 'Westbound',
}

export enum Heading {
    N = 'N',
    S = 'S',
    E = 'E',
    W = 'W',
}

export enum Juncture {
    A = 'A', // arrival
    D = 'D', // departure
}

export interface Route {
    route: string;
    name: string;
    color: string;
}

export interface Point {
    latitude: number;
    longitude: number;
}

export interface Stop extends Point {
    name: string;
    id: string;
    route: string;
}

export interface Pattern {
    fillColor: string;
    strokeColor: string;
    pid: number;
    route: string;
    paths: Point[];
    stops: Stop[];
}

export interface Vehicle {
    id: string;
    timestamp: string;
    position: Point;
    heading: Heading;
    route: string;
    destination: string;
    delayed: boolean;
}

export interface Prediction {
    type: Juncture;
    name: string;
    id: string;
    stopId: string;
    route: string;
    direction: Direction;
    time: number;
    timestamp: string;
    delayed: boolean;
}

export interface DataStoreState {
    currentLocation: Point;
    routes: Route[];
    patterns: Pattern[];
    stop: Stop | null;
    error?: any;
    vehicles: Vehicle[];
}
