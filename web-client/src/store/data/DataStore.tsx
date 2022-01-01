import { createContext, FunctionComponent, ReactNode, useReducer, useContext, Dispatch } from 'react';

import { useToast } from '@chakra-ui/react';

import {
    cancelGetPattern,
    cancelGetSingleVehicle,
    cancelGetVehicles,
    getPattern,
    getRoutes,
    onRouteDeselect,
    onRouteSelect,
} from 'store/data/DataService';
import { Route, DataStoreState, Pattern, Stop, Point, Vehicle } from 'store/data/DataStore.Types';
import { SystemStoreActionType, useSystemStoreDispatch } from 'store/system/SystemStore';

export enum DataStoreActionType {
    SetRoute,
    SetPattern,
    SetStop,
    SetCurrentLocation,
    SetVehicleRoutes,
    SetVehicles,
    RemoveRoute,
    RemoveAllRoutes,
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

interface PayloadSetVehicleRoutes {
    route: Set<string>;
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
        | PayloadSetVehicleRoutes
        | PayloadSetVehicles;
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
    vehicleRoutes: new Set(),
    vehicles: [],
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
            const updatedVehicleRoutes = new Set(Array.from(state.vehicleRoutes).filter((route) => route !== id));

            return {
                ...state,
                routes: [...updatedRoutes],
                patterns: [...updatedPatterns],
                vehicleRoutes: updatedVehicleRoutes,
            };
        case DataStoreActionType.RemoveAllRoutes:
            return { ...state, routes: [], patterns: [], vehicleRoutes: new Set() };
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
        case DataStoreActionType.SetVehicleRoutes:
            return {
                ...state,
                vehicleRoutes: (action.payload as PayloadSetVehicleRoutes).route,
            };
        case DataStoreActionType.SetVehicles:
            return {
                ...state,
                vehicles: (action.payload as PayloadSetVehicles).vehicles,
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
    getRoutes: () => Promise<Route[] | null>;
    setRoute: (route: Route) => void;
    removeRoute: (id: string) => void;
    removeAllRoutes: () => void;
    openStop: (stop: Stop) => void;
    closeStop: () => void;
    setCurrentLocation: (location: Point) => void;
    setVehicleRoutes: (route: Set<string>) => void;
    setVehicles: (vehicles: Vehicle[]) => void;
}

export const useDataStore = (): [DataStoreState, DataStoreActionApis] => {
    const dispatch = useDataStoreDispatch();
    const systemDispatch = useSystemStoreDispatch();
    const toast = useToast();

    const actionApis: DataStoreActionApis = {
        getRoutes: async () => {
            try {
                systemDispatch({ type: SystemStoreActionType.SetRoutesLoading, payload: { loading: true } });
                const response = await getRoutes();

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
                toast({ description: err.response.data, status: 'error' });
            }
        },
        removeRoute: (id: string) => {
            cancelGetSingleVehicle();
            cancelGetPattern();
            cancelGetVehicles();
            onRouteDeselect(id);
            dispatch({ type: DataStoreActionType.RemoveRoute, payload: { id } });
        },
        removeAllRoutes: () => {
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
        setVehicleRoutes: (route: Set<string>) => {
            dispatch({ type: DataStoreActionType.SetVehicleRoutes, payload: { route } });
        },
        setVehicles: (vehicles: Vehicle[]) => {
            console.log({ vehicles });
            dispatch({ type: DataStoreActionType.SetVehicles, payload: { vehicles } });
        },
    };

    return [useDataStoreState(), actionApis];
};
