import { createContext, FunctionComponent, ReactNode, useReducer, useContext, Dispatch } from 'react';

import { useToast } from '@chakra-ui/react';

import {
    cancelGetPattern,
    getPattern,
    getRoutes,
    getTrainPatterns,
    getTrainRoutes,
    onActive,
    onIdle,
    onRouteDeselect,
    onRouteRemoveAll,
    onRouteSelect,
} from 'store/data/DataService';
import {
    Route,
    DataStoreState,
    Pattern,
    Stop,
    Point,
    Vehicle,
    FavoriteStopsKey,
    FavoriteRoutesKey,
    SearchHistoryKey,
    RouteType,
} from 'store/data/DataStore.Types';
import { SystemStoreActionType, useSystemStoreDispatch } from 'store/system/SystemStore';

export enum DataStoreActionType {
    SetRoute,
    SetPattern,
    SetStop,
    SetVehicle,
    SetCurrentLocation,
    SetVehicles,
    SetFavoriteStops,
    SetFavoriteRoutes,
    SetSearchHistory,
    RemoveRoute,
    RemoveAllRoutes,
}

interface PayloadSetSearchHistory {
    history: Array<string>;
}

interface PayloadSetVehicle {
    vehicle: Vehicle | null;
}

interface PayloadSetFavoriteRoutes {
    savedRoutes: Record<string, Route>;
}

interface PayloadSetFavoriteStops {
    savedStops: Record<string, Stop>;
}

interface PayloadSetRoute {
    route: Route;
}

interface PayloadRemoveRoute {
    id: string;
}

interface PayloadRemoveAllRoutes {
    type?: RouteType;
}

interface PayloadSetPattern {
    pattern: Pattern[];
}

interface PayloadSetStop {
    stop: Stop | null;
}

interface PayloadSetCurrentLocation {
    location: Point;
}

interface PayloadSetVehicles {
    vehicles: Vehicle[];
}

interface DataStoreAction {
    type: DataStoreActionType;
    payload?:
        | PayloadSetRoute
        | PayloadRemoveRoute
        | PayloadRemoveAllRoutes
        | PayloadSetPattern
        | PayloadSetStop
        | PayloadSetCurrentLocation
        | PayloadSetVehicles
        | PayloadSetFavoriteStops
        | PayloadSetFavoriteRoutes
        | PayloadSetVehicle
        | PayloadSetSearchHistory;
}

interface DataStoreProviderProps {
    children: ReactNode;
}

export const initialStoreState: DataStoreState = {
    stop: null,
    vehicle: null,
    routes: {},
    patterns: [],
    error: undefined,
    currentLocation: { lat: 41.88, lng: -87.65 },
    vehicles: [],
    savedStops: JSON.parse(localStorage.getItem(FavoriteStopsKey) || '{}'),
    savedRoutes: JSON.parse(localStorage.getItem(FavoriteRoutesKey) || '{}'),
    searchHistory: [],
};

const DataStoreStateContext = createContext<DataStoreState | undefined>(undefined);
const DataStoreDispatchContext = createContext<Dispatch<DataStoreAction> | undefined>(undefined);

const storeReducer = (state: DataStoreState, action: DataStoreAction): DataStoreState => {
    switch (action.type) {
        case DataStoreActionType.SetRoute:
            const { route } = action.payload as PayloadSetRoute;
            return { ...state, routes: { ...state.routes, [route.route]: route } };
        case DataStoreActionType.RemoveRoute:
            const { id } = action.payload as PayloadRemoveRoute;
            const updatedRoutes = { ...state.routes };
            delete updatedRoutes[id];
            const updatedPatterns = state.patterns.filter((pattern) => pattern.route !== id);
            const updatedVehicles = state.vehicles.filter((vehicle) => vehicle.route !== id);

            return {
                ...state,
                routes: { ...updatedRoutes },
                patterns: [...updatedPatterns],
                vehicles: [...updatedVehicles],
            };
        case DataStoreActionType.RemoveAllRoutes:
            const { type } = action.payload as PayloadRemoveAllRoutes;
            if (type === RouteType.All) {
                return { ...state, routes: {}, patterns: [], vehicles: [] };
            } else {
                const currentRoutes = { ...state.routes };
                const updatedPatterns = state.patterns.filter((pattern) => pattern.type !== type);
                const updatedVehicles = state.vehicles.filter((vehicle) => vehicle.type !== type);
                const updatedRoutes = Object.values(currentRoutes).reduce((acc: Record<string, Route>, route) => {
                    if (!acc[route.route] && route.type !== type) {
                        acc[route.route] = route;
                    }

                    return acc;
                }, {});

                return { ...state, routes: updatedRoutes, patterns: updatedPatterns, vehicles: updatedVehicles };
            }
        case DataStoreActionType.SetPattern:
            return {
                ...state,
                patterns: [...state.patterns, ...(action.payload as PayloadSetPattern).pattern],
            };
        case DataStoreActionType.SetStop:
            return {
                ...state,
                stop: (action.payload as PayloadSetStop).stop,
            };
        case DataStoreActionType.SetCurrentLocation:
            return {
                ...state,
                currentLocation: (action.payload as PayloadSetCurrentLocation).location,
            };

        case DataStoreActionType.SetVehicles:
            return {
                ...state,
                vehicles: (action.payload as PayloadSetVehicles).vehicles,
            };
        case DataStoreActionType.SetFavoriteStops:
            localStorage.setItem(
                FavoriteStopsKey,
                JSON.stringify((action.payload as PayloadSetFavoriteStops).savedStops),
            );

            return {
                ...state,
                savedStops: (action.payload as PayloadSetFavoriteStops).savedStops,
            };
        case DataStoreActionType.SetFavoriteRoutes:
            localStorage.setItem(
                FavoriteRoutesKey,
                JSON.stringify((action.payload as PayloadSetFavoriteRoutes).savedRoutes),
            );

            return {
                ...state,
                savedRoutes: (action.payload as PayloadSetFavoriteRoutes).savedRoutes,
            };
        case DataStoreActionType.SetVehicle:
            return {
                ...state,
                vehicle: (action.payload as PayloadSetVehicle).vehicle,
            };
        case DataStoreActionType.SetSearchHistory:
            return {
                ...state,
                searchHistory: (action.payload as PayloadSetSearchHistory).history,
            };
        default: {
            throw new Error(`Invalid action -- ${action.type}`);
        }
    }
};

export const DataStoreProvider: FunctionComponent<DataStoreProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(storeReducer, initialStoreState);

    return (
        <DataStoreStateContext.Provider value={state}>
            <DataStoreDispatchContext.Provider value={dispatch}>{children}</DataStoreDispatchContext.Provider>
        </DataStoreStateContext.Provider>
    );
};

const useDataStoreState = (): DataStoreState => {
    const context = useContext(DataStoreStateContext);

    if (context === undefined) {
        throw new Error('useDataStoreState must be used within DataStoreProvider');
    }

    return context;
};

const useDataStoreDispatch = (): Dispatch<DataStoreAction> => {
    const context = useContext(DataStoreDispatchContext);

    if (context === undefined) {
        throw new Error('useDataStoreState must be used within DataStoreProvider');
    }

    return context;
};

interface DataStoreActionApis {
    getRoutes: (search?: string, filter?: string, limit?: number, index?: number) => Promise<Route[] | null>;
    getTrainRoutes: (filter?: string) => Promise<Route[] | null>;
    setRoute: (route: Route) => void;
    removeRoute: (id: string, type: RouteType) => void;
    removeAllRoutes: (type?: RouteType) => void;
    openStop: (stop: Stop) => void;
    closeStop: () => void;
    setCurrentLocation: (location: Point) => void;
    setVehicles: (vehicles: Vehicle[]) => void;
    onIdle: () => void;
    onActive: () => void;
    saveStop: (stop: Stop) => void;
    unSaveStop: (id: string) => void;
    saveRoute: (route: Route) => void;
    unSaveRoute: (id: string) => void;
    openVehicle: (vehicle: Vehicle) => void;
    closeVehicle: () => void;
    setSearchHistoryArray: () => void;
    setSearchHistoryItem: (item: string) => void;
    removeSearchHistoryItem: (item: string) => void;
}

export const useDataStore = (): [DataStoreState, DataStoreActionApis] => {
    const state = useDataStoreState();
    const dispatch = useDataStoreDispatch();
    const systemDispatch = useSystemStoreDispatch();
    const toast = useToast();

    const actionApis: DataStoreActionApis = {
        getRoutes: async (search?: string, filter?: string, limit?: number, index?: number) => {
            try {
                systemDispatch({ type: SystemStoreActionType.SetRoutesLoading, payload: { loading: true } });
                const response = await getRoutes(search, filter, limit, index);

                systemDispatch({ type: SystemStoreActionType.SetRoutesLoading, payload: { loading: false } });

                return response;
            } catch (err: any) {
                systemDispatch({ type: SystemStoreActionType.SetRoutesLoading, payload: { loading: false } });
                toast({ description: err.response.data, status: 'error' });

                return null;
            }
        },
        getTrainRoutes: async (filter?: string) => {
            try {
                systemDispatch({ type: SystemStoreActionType.SetRoutesLoading, payload: { loading: true } });
                const response = await getTrainRoutes(filter);

                systemDispatch({ type: SystemStoreActionType.SetRoutesLoading, payload: { loading: false } });

                return response;
            } catch (err: any) {
                systemDispatch({ type: SystemStoreActionType.SetRoutesLoading, payload: { loading: false } });
                toast({ description: err.response.data, status: 'error' });

                return null;
            }
        },
        setRoute: async (route: Route) => {
            dispatch({ type: DataStoreActionType.SetRoute, payload: { route } });
            systemDispatch({ type: SystemStoreActionType.SetPatternLoading, payload: { loading: true } });

            try {
                if (route.type === RouteType.Bus) {
                    const response = await getPattern(route.route, route.color);

                    onRouteSelect(route.route, route.color, route.type as RouteType);
                    systemDispatch({ type: SystemStoreActionType.SetPatternLoading, payload: { loading: false } });
                    dispatch({ type: DataStoreActionType.SetPattern, payload: { pattern: response } });
                } else {
                    const response = await getTrainPatterns(route.route, route.color);

                    onRouteSelect(route.route, route.color, route.type as RouteType);
                    systemDispatch({ type: SystemStoreActionType.SetPatternLoading, payload: { loading: false } });
                    dispatch({ type: DataStoreActionType.SetPattern, payload: { pattern: response } });
                }
            } catch (err: any) {
                systemDispatch({ type: SystemStoreActionType.SetPatternLoading, payload: { loading: false } });
                if (err.response) {
                    toast({ description: err.response.data, status: 'error' });
                }
            }
        },
        removeRoute: (id: string, type: RouteType) => {
            cancelGetPattern();
            onRouteDeselect(id, type);
            dispatch({ type: DataStoreActionType.RemoveRoute, payload: { id } });
        },
        removeAllRoutes: (type?: RouteType) => {
            onRouteRemoveAll(type);
            dispatch({ type: DataStoreActionType.RemoveAllRoutes, payload: { type } });
        },
        openStop: (stop: Stop) => {
            dispatch({ type: DataStoreActionType.SetStop, payload: { stop } });
        },
        closeStop: () => {
            dispatch({ type: DataStoreActionType.SetStop, payload: { stop: null } });
        },
        setCurrentLocation: (location: Point) => {
            dispatch({ type: DataStoreActionType.SetCurrentLocation, payload: { location } });
        },
        setVehicles: (vehicles: Vehicle[]) => {
            dispatch({ type: DataStoreActionType.SetVehicles, payload: { vehicles } });
        },
        onIdle: () => {
            onIdle();
        },
        onActive: () => {
            onActive();
        },
        saveStop: (stop: Stop) => {
            const savedStops = { ...state.savedStops };

            savedStops[stop.id] = stop;
            dispatch({ type: DataStoreActionType.SetFavoriteStops, payload: { savedStops } });
        },
        unSaveStop: (id: string) => {
            const savedStops = { ...state.savedStops };
            delete savedStops[id];

            dispatch({ type: DataStoreActionType.SetFavoriteStops, payload: { savedStops } });
        },
        saveRoute: (route: Route) => {
            const savedRoutes = { ...state.savedRoutes };

            savedRoutes[route.route] = route;
            dispatch({ type: DataStoreActionType.SetFavoriteRoutes, payload: { savedRoutes } });
        },
        unSaveRoute: (id: string) => {
            const savedRoutes = { ...state.savedRoutes };
            delete savedRoutes[id];

            dispatch({ type: DataStoreActionType.SetFavoriteRoutes, payload: { savedRoutes } });
        },
        openVehicle: (vehicle: Vehicle) => {
            dispatch({ type: DataStoreActionType.SetVehicle, payload: { vehicle } });
        },
        closeVehicle: () => {
            dispatch({ type: DataStoreActionType.SetVehicle, payload: { vehicle: null } });
        },
        setSearchHistoryArray: () => {
            const history = JSON.parse(localStorage.getItem(SearchHistoryKey) || '[]');
            dispatch({ type: DataStoreActionType.SetSearchHistory, payload: { history } });
        },
        setSearchHistoryItem: (item: string) => {
            const history: Array<string> = JSON.parse(localStorage.getItem(SearchHistoryKey) || '[]');
            const itemIdx = history.findIndex((i) => i === item);

            if (itemIdx !== -1) {
                history.splice(itemIdx, 1);
            }

            if (history.length >= 5) {
                history.pop();
            }

            history.unshift(item);
            localStorage.setItem(SearchHistoryKey, JSON.stringify(history));
            dispatch({ type: DataStoreActionType.SetSearchHistory, payload: { history } });
        },
        removeSearchHistoryItem: (item: string) => {
            const history: Array<string> = JSON.parse(localStorage.getItem(SearchHistoryKey) || '[]');
            const itemIdx = history.findIndex((i) => i === item);

            if (itemIdx !== -1) {
                history.splice(itemIdx, 1);
            }
            localStorage.setItem(SearchHistoryKey, JSON.stringify(history));
            dispatch({ type: DataStoreActionType.SetSearchHistory, payload: { history } });
        },
    };

    return [useDataStoreState(), actionApis];
};
