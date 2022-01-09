import { createContext, FunctionComponent, ReactNode, useReducer, useContext, Dispatch } from 'react';

import { useToast } from '@chakra-ui/react';

import {
    cancelGetPattern,
    getPattern,
    getRoutes,
    onActive,
    onIdle,
    onRouteDeselect,
    onRouteRemoveAll,
    onRouteSelect,
} from 'store/data/DataService';
import { Route, DataStoreState, Pattern, Stop, Point, Vehicle, FavoriteStopsKey } from 'store/data/DataStore.Types';
import { SystemStoreActionType, useSystemStoreDispatch } from 'store/system/SystemStore';

export enum DataStoreActionType {
    SetRoute,
    SetPattern,
    SetStop,
    SetCurrentLocation,
    SetVehicles,
    SetFavoriteStops,
    RemoveRoute,
    RemoveAllRoutes,
}

interface PayloadSetFavoriteStops {
    favoriteStops: Record<string, Stop>;
}

interface PayloadSetRoute {
    route: Route;
}

interface PayloadRemoveRoute {
    id: string;
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
        | PayloadSetPattern
        | PayloadSetStop
        | PayloadSetCurrentLocation
        | PayloadSetVehicles
        | PayloadSetFavoriteStops;
}

interface DataStoreProviderProps {
    children: ReactNode;
}

export const initialStoreState: DataStoreState = {
    stop: null,
    routes: [],
    patterns: [],
    error: undefined,
    currentLocation: { lat: 41.88, lng: -87.65 },
    vehicles: [],
    favoriteStops: JSON.parse(localStorage.getItem(FavoriteStopsKey) || '{}'),
};

const DataStoreStateContext = createContext<DataStoreState | undefined>(undefined);
const DataStoreDispatchContext = createContext<Dispatch<DataStoreAction> | undefined>(undefined);

const storeReducer = (state: DataStoreState, action: DataStoreAction): DataStoreState => {
    switch (action.type) {
        case DataStoreActionType.SetRoute:
            return { ...state, routes: [...state.routes, { ...(action.payload as PayloadSetRoute).route }] };
        case DataStoreActionType.RemoveRoute:
            const { id } = action.payload as PayloadRemoveRoute;
            const updatedRoutes = state.routes.filter((route) => route.route !== id);
            const updatedPatterns = state.patterns.filter((pattern) => pattern.route !== id);
            const updatedVehicles = state.vehicles.filter((vehicle) => vehicle.route !== id);

            return {
                ...state,
                routes: [...updatedRoutes],
                patterns: [...updatedPatterns],
                vehicles: [...updatedVehicles],
            };
        case DataStoreActionType.RemoveAllRoutes:
            return { ...state, routes: [], patterns: [], vehicles: [] };
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
            localStorage.setItem(FavoriteStopsKey, JSON.stringify((action.payload as PayloadSetFavoriteStops).favoriteStops));

            return {
                ...state,
                favoriteStops: (action.payload as PayloadSetFavoriteStops).favoriteStops,
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
    setRoute: (route: Route) => void;
    removeRoute: (id: string) => void;
    removeAllRoutes: () => void;
    openStop: (stop: Stop) => void;
    closeStop: () => void;
    setCurrentLocation: (location: Point) => void;
    setVehicles: (vehicles: Vehicle[]) => void;
    onIdle: () => void;
    onActive: () => void;
    saveStop: (stop: Stop) => void;
    unSaveStop: (id: string) => void;
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
        setRoute: async (route: Route) => {
            dispatch({ type: DataStoreActionType.SetRoute, payload: { route } });
            systemDispatch({ type: SystemStoreActionType.SetPatternLoading, payload: { loading: true } });

            try {
                const response = await getPattern(route.route, route.color);

                onRouteSelect(route.route);
                systemDispatch({ type: SystemStoreActionType.SetPatternLoading, payload: { loading: false } });
                dispatch({ type: DataStoreActionType.SetPattern, payload: { pattern: response } });
            } catch (err: any) {
                systemDispatch({ type: SystemStoreActionType.SetPatternLoading, payload: { loading: false } });
                if (err.response) {
                    toast({ description: err.response.data, status: 'error' });
                }
            }
        },
        removeRoute: (id: string) => {
            cancelGetPattern();
            onRouteDeselect(id);
            dispatch({ type: DataStoreActionType.RemoveRoute, payload: { id } });
        },
        removeAllRoutes: () => {
            onRouteRemoveAll();
            dispatch({ type: DataStoreActionType.RemoveAllRoutes });
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
            const favoriteStops = { ...state.favoriteStops };
            favoriteStops[stop.id] = stop;
            dispatch({ type: DataStoreActionType.SetFavoriteStops, payload: { favoriteStops } });
        },
        unSaveStop: (id: string) => {
            const favoriteStops = { ...state.favoriteStops };
            delete favoriteStops[id];

            dispatch({ type: DataStoreActionType.SetFavoriteStops, payload: { favoriteStops } });
        },
    };

    return [useDataStoreState(), actionApis];
};
