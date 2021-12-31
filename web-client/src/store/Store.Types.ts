import { Locale } from '../i18n/LocaleProvider';

export const ColorModeKey = 'chakra-ui-color-mode';
export const LocaleKey = 'cta-maps-locale';

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

export enum ColorMode {
    Light = 'light',
    Dark = 'dark',
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
    route: number;
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

export interface Setting {
    colorMode: ColorMode;
    locale: Locale;
}

export enum Status {
    Success = 'success',
    InProgress = 'in_progress',
    Failure = 'failure',
}

export interface AppStatus {
    web: Status;
    server: Status;
}

export interface StoreState {
    systemLoading: boolean;
    routeSelectOpen: boolean;
    infoOpen: boolean;
    settingsOpen: boolean;
    idleAlertOpen: boolean;
    dragging: boolean;
    routesLoading: boolean;
    patternLoading: boolean;
    currentLocation: Point;
    vehicleRoutes: Set<string>;
    routes: Route[];
    patterns: Pattern[];
    stop: Stop | null;
    settings: Setting;
    error?: any;
}
