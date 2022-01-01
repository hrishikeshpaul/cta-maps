import { createContext, FunctionComponent, ReactNode, useReducer, useContext, Dispatch } from 'react';

import { useToast } from '@chakra-ui/react';

import { cancelGetPattern, cancelGetSingleVehicle, cancelGetVehicles, getPattern, getRoutes } from './DataService';
import { Route, DataStoreState, Pattern, Stop, Point, ColorMode, ColorModeKey, LocaleKey } from './DataStore.Types';
import { Locale } from '../../i18n/LocaleProvider';
import { SystemStoreActionType, useSystemStoreDispatch } from 'store/system/SystemStore';

export enum DataStoreActionType {
    SetRouteSelect,
    SetDragging,
    SetRoutesLoading,
    SetRoute,
    SetPatternLoading,
    SetPattern,
    SetInfo,
    SetStop,
    SetCurrentLocation,
    SetVehicleRoutes,
    SetSettingsDrawer,
    SetColorMode,
    SetLocale,
    SetIdleAlert,
    SetSystemLoading,
    RemoveRoute,
    RemoveAllRoutes,
}

interface PayloadSetRouteSelect {
    open: boolean;
}

interface PayloadSetDragging {
    dragging: boolean;
}

interface PayloadRoutesLoading {
    loading: boolean;
}

interface PayloadSetRoute {
    route: Route;
}

interface PayloadRemoveRoute {
    id: string;
}

interface PayloadPatternLoading {
    loading: boolean;
}

interface PayloadSetPattern {
    pattern: Pattern[];
}

interface PayloadSetInfo {
    open: boolean;
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

interface PayloadSetSettingsDrawer {
    open: boolean;
}

interface PayloadSetColorMode {
    mode: ColorMode;
}

interface PayloadSetLocale {
    locale: Locale;
}

interface PayloadSetIdleAlert {
    open: boolean;
}

interface PayloadSetSystemLoading {
    loading: boolean;
}

interface DataStoreAction {
    type: DataStoreActionType;
    payload?:
        | PayloadSetRouteSelect
        | PayloadSetDragging
        | PayloadRoutesLoading
        | PayloadSetRoute
        | PayloadRemoveRoute
        | PayloadPatternLoading
        | PayloadSetPattern
        | PayloadSetInfo
        | PayloadSetStop
        | PayloadSetCurrentLocation
        | PayloadSetVehicleRoutes
        | PayloadSetSettingsDrawer
        | PayloadSetColorMode
        | PayloadSetLocale
        | PayloadSetIdleAlert
        | PayloadSetSystemLoading;
}

interface DataStoreProviderProps {
    children: ReactNode;
}

export const initialStoreState: DataStoreState = {
    systemLoading: true,
    routeSelectOpen: false,
    idleAlertOpen: false,
    dragging: false,
    routesLoading: false,
    patternLoading: false,
    infoOpen: false,
    settingsOpen: false,
    stop: null,
    routes: [],
    patterns: [],
    error: undefined,
    currentLocation: { lat: 41.88, lng: -87.65 },
    vehicleRoutes: new Set(),
    settings: {
        colorMode: (localStorage.getItem(ColorModeKey) as ColorMode) || ColorMode.Light,
        locale: (localStorage.getItem(LocaleKey) as Locale) || Locale.EN,
    },
};

const DataStoreStateContext = createContext<DataStoreState | undefined>(undefined);
const DataStoreDispatchContext = createContext<Dispatch<DataStoreAction> | undefined>(undefined);

const storeReducer = (state: DataStoreState, action: DataStoreAction): DataStoreState => {
    switch (action.type) {
        case DataStoreActionType.SetRouteSelect:
            return { ...state, routeSelectOpen: (action.payload as PayloadSetRouteSelect).open };
        case DataStoreActionType.SetDragging:
            return { ...state, dragging: (action.payload as PayloadSetDragging).dragging };
        case DataStoreActionType.SetRoutesLoading:
            return { ...state, routesLoading: (action.payload as PayloadRoutesLoading).loading };
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
        case DataStoreActionType.SetPatternLoading:
            return {
                ...state,
                patternLoading: (action.payload as PayloadPatternLoading).loading,
            };
        case DataStoreActionType.SetPattern:
            return {
                ...state,
                patterns: [...state.patterns, ...(action.payload as PayloadSetPattern).pattern],
            };
        case DataStoreActionType.SetInfo:
            return {
                ...state,
                infoOpen: (action.payload as PayloadSetInfo).open,
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
        case DataStoreActionType.SetSettingsDrawer:
            return {
                ...state,
                settingsOpen: (action.payload as PayloadSetSettingsDrawer).open,
            };
        case DataStoreActionType.SetColorMode:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    colorMode: (action.payload as PayloadSetColorMode).mode,
                },
            };
        case DataStoreActionType.SetLocale:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    locale: (action.payload as PayloadSetLocale).locale,
                },
            };
        case DataStoreActionType.SetIdleAlert:
            return {
                ...state,
                idleAlertOpen: (action.payload as PayloadSetIdleAlert).open,
            };
        case DataStoreActionType.SetSystemLoading:
            return {
                ...state,
                systemLoading: (action.payload as PayloadSetSystemLoading).loading,
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
    openRouteSelect: () => void;
    closeRouteSelect: () => void;
    setDragging: (value: boolean) => void;
    getRoutes: () => Promise<Route[] | null>;
    setRoute: (route: Route) => void;
    removeRoute: (id: string) => void;
    removeAllRoutes: () => void;
    openInfo: () => void;
    closeInfo: () => void;
    openStop: (stop: Stop) => void;
    closeStop: () => void;
    setCurrentLocation: (location: Point) => void;
    setVehicleRoutes: (route: Set<string>) => void;
    openSettings: () => void;
    closeSettings: () => void;
    setColorMode: (mode: ColorMode) => void;
    setLocale: (locale: Locale) => void;
    openIdleAlert: () => void;
    closeIdleAlert: () => void;
    setSystemLoading: (loading: boolean) => void;
}

export const useDataStore = (): [DataStoreState, DataStoreActionApis] => {
    const dispatch = useDataStoreDispatch();
    const systemDispatch = useSystemStoreDispatch();
    const toast = useToast();

    const actionApis: DataStoreActionApis = {
        openRouteSelect: () => {
            dispatch({ type: DataStoreActionType.SetRouteSelect, payload: { open: true } });
        },
        closeRouteSelect: async () => {
            dispatch({ type: DataStoreActionType.SetRouteSelect, payload: { open: false } });
        },
        openInfo: () => {
            dispatch({ type: DataStoreActionType.SetInfo, payload: { open: true } });
        },
        closeInfo: async () => {
            dispatch({ type: DataStoreActionType.SetInfo, payload: { open: false } });
        },
        setDragging: (dragging: boolean) => {
            dispatch({ type: DataStoreActionType.SetDragging, payload: { dragging } });
        },
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
            dispatch({ type: DataStoreActionType.SetPatternLoading, payload: { loading: true } });

            try {
                const response = await getPattern(route.route, route.color);

                dispatch({ type: DataStoreActionType.SetPatternLoading, payload: { loading: false } });
                dispatch({ type: DataStoreActionType.SetPattern, payload: { pattern: response } });
            } catch (err: any) {
                dispatch({ type: DataStoreActionType.SetPatternLoading, payload: { loading: false } });
                toast({ description: err.response.data, status: 'error' });
            }
        },
        removeRoute: (id: string) => {
            cancelGetSingleVehicle();
            cancelGetPattern();
            cancelGetVehicles();
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
        openSettings: () => {
            dispatch({ type: DataStoreActionType.SetSettingsDrawer, payload: { open: true } });
        },
        closeSettings: () => {
            dispatch({ type: DataStoreActionType.SetSettingsDrawer, payload: { open: false } });
        },
        setColorMode: (mode: ColorMode) => {
            dispatch({ type: DataStoreActionType.SetColorMode, payload: { mode } });
        },
        setLocale: (locale: Locale) => {
            localStorage.setItem(LocaleKey, locale);

            dispatch({ type: DataStoreActionType.SetLocale, payload: { locale } });
        },
        openIdleAlert: () => {
            dispatch({ type: DataStoreActionType.SetIdleAlert, payload: { open: true } });
        },
        closeIdleAlert: () => {
            dispatch({ type: DataStoreActionType.SetIdleAlert, payload: { open: false } });
        },
        setSystemLoading: (loading: boolean) => {
            dispatch({ type: DataStoreActionType.SetSystemLoading, payload: { loading } });
        },
    };

    return [useDataStoreState(), actionApis];
};
