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
    seq: number;
    lat: number;
    lon: number;
    typ: PointType;
    stpid: string;
    stpnm: string;
    pdist: number;
}

export interface Pattern {
    pid: number;
    ln: number;
    rtdir: Direction;
    pt: Point[];
}

export interface PatternExtended extends Pattern {
    route: Route;
}

export interface StoreState {
    routeSelectOpen: boolean;
    dragging: boolean;
    routesLoading: boolean;
    patternLoading: boolean;
    routes: Route[];
    patterns: PatternExtended[];
}
