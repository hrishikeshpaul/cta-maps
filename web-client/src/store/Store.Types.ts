export enum PointType {
    S = 'S',
    W = 'W',
}

export enum Direction {
    Northbound = 'Northbound',
    Southbound = 'Southbound',
    Eastbound = 'Eastbound',
    Westbound = 'Westbound',
}

export interface Route {
    route: string;
    name: string;
    color: string;
}

export interface Point {
    lat: number;
    lng: number;
}

export interface Stop extends Point {
    name: string;
    id: string;
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
    heading: 'N' | 'S' | 'E' | 'W';
    route: number;
    destination: string;
    delayed: boolean;
}

export interface StoreState {
    routeSelectOpen: boolean;
    infoOpen: boolean;
    dragging: boolean;
    routesLoading: boolean;
    patternLoading: boolean;
    routes: Route[];
    patterns: Pattern[];
    error?: any;
}
