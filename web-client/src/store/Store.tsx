import { createContext, FunctionComponent, ReactNode, useReducer, useContext, Dispatch } from 'react';

import { useToast } from '@chakra-ui/react';

import { getPattern, getRoutes } from './Service';
import { Route, StoreState, Pattern, Stop, Point, ColorMode, ColorModeKey, LocaleKey } from './Store.Types';
import { Locale } from '../i18n/Config';

export enum StoreActionType {
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

interface StoreAction {
    type: StoreActionType;
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
        | PayloadSetIdleAlert;
}

interface StoreProviderProps {
    children: ReactNode;
}

export const initialStoreState: StoreState = {
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

const StoreStateContext = createContext<StoreState | undefined>(undefined);
const StoreDispatchContext = createContext<Dispatch<StoreAction> | undefined>(undefined);

const storeReducer = (state: StoreState, action: StoreAction): StoreState => {
    switch (action.type) {
        case StoreActionType.SetRouteSelect:
            return { ...state, routeSelectOpen: (action.payload as PayloadSetRouteSelect).open };
        case StoreActionType.SetDragging:
            return { ...state, dragging: (action.payload as PayloadSetDragging).dragging };
        case StoreActionType.SetRoutesLoading:
            return { ...state, routesLoading: (action.payload as PayloadRoutesLoading).loading };
        case StoreActionType.SetRoute:
            return { ...state, routes: [...state.routes, { ...(action.payload as PayloadSetRoute).route }] };
        case StoreActionType.RemoveRoute:
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
        case StoreActionType.RemoveAllRoutes:
            return { ...state, routes: [], patterns: [], vehicleRoutes: new Set() };
        case StoreActionType.SetPatternLoading:
            return {
                ...state,
                patternLoading: (action.payload as PayloadPatternLoading).loading,
            };
        case StoreActionType.SetPattern:
            return {
                ...state,
                patterns: [...state.patterns, ...(action.payload as PayloadSetPattern).pattern],
            };
        case StoreActionType.SetInfo:
            return {
                ...state,
                infoOpen: (action.payload as PayloadSetInfo).open,
            };
        case StoreActionType.SetStop:
            return {
                ...state,
                stop: (action.payload as PayloadSetStop).stop,
            };
        case StoreActionType.SetCurrentLocation:
            return {
                ...state,
                currentLocation: (action.payload as PayloadSetCurrentLocation).location,
            };
        case StoreActionType.SetVehicleRoutes:
            return {
                ...state,
                vehicleRoutes: (action.payload as PayloadSetVehicleRoutes).route,
            };
        case StoreActionType.SetSettingsDrawer:
            return {
                ...state,
                settingsOpen: (action.payload as PayloadSetSettingsDrawer).open,
            };
        case StoreActionType.SetColorMode:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    colorMode: (action.payload as PayloadSetColorMode).mode,
                },
            };
        case StoreActionType.SetLocale:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    locale: (action.payload as PayloadSetLocale).locale,
                },
            };
        case StoreActionType.SetIdleAlert:
            return {
                ...state,
                idleAlertOpen: (action.payload as PayloadSetIdleAlert).open,
            };
        default: {
            throw new Error(`Invalid action -- ${action.type}`);
        }
    }
};

export const StoreProvider: FunctionComponent<StoreProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(storeReducer, initialStoreState);

    return (
        <StoreStateContext.Provider value={state}>
            <StoreDispatchContext.Provider value={dispatch}>{children}</StoreDispatchContext.Provider>
        </StoreStateContext.Provider>
    );
};

const useStoreState = (): StoreState => {
    const context = useContext(StoreStateContext);

    if (context === undefined) {
        throw new Error('useStoreState must be used within StoreProvider');
    }

    return context;
};

const useStoreDispatch = (): Dispatch<StoreAction> => {
    const context = useContext(StoreDispatchContext);

    if (context === undefined) {
        throw new Error('UseStoreState must be used within StoreProvider');
    }

    return context;
};

interface StoreActionApis {
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
}

export const useStore = (): [StoreState, StoreActionApis] => {
    const dispatch = useStoreDispatch();
    const toast = useToast();

    const actionApis: StoreActionApis = {
        openRouteSelect: () => {
            dispatch({ type: StoreActionType.SetRouteSelect, payload: { open: true } });
        },
        closeRouteSelect: async () => {
            dispatch({ type: StoreActionType.SetRouteSelect, payload: { open: false } });
        },
        openInfo: () => {
            dispatch({ type: StoreActionType.SetInfo, payload: { open: true } });
        },
        closeInfo: async () => {
            dispatch({ type: StoreActionType.SetInfo, payload: { open: false } });
        },
        setDragging: (dragging: boolean) => {
            dispatch({ type: StoreActionType.SetDragging, payload: { dragging } });
        },
        getRoutes: async () => {
            try {
                dispatch({ type: StoreActionType.SetRoutesLoading, payload: { loading: true } });
                const response = await getRoutes();

                dispatch({ type: StoreActionType.SetRoutesLoading, payload: { loading: false } });

                return response;
            } catch (err: any) {
                dispatch({ type: StoreActionType.SetRoutesLoading, payload: { loading: false } });
                toast({ description: err.response.data, status: 'error' });

                return null;
            }
        },
        setRoute: async (route: Route) => {
            dispatch({ type: StoreActionType.SetRoute, payload: { route } });
            dispatch({ type: StoreActionType.SetPatternLoading, payload: { loading: true } });

            try {
                const response = await getPattern(route.route, route.color);

                dispatch({ type: StoreActionType.SetPatternLoading, payload: { loading: false } });
                dispatch({ type: StoreActionType.SetPattern, payload: { pattern: response } });
            } catch (err: any) {
                dispatch({ type: StoreActionType.SetPatternLoading, payload: { loading: false } });
                toast({ description: err.response.data, status: 'error' });
            }
        },
        removeRoute: (id: string) => {
            dispatch({ type: StoreActionType.RemoveRoute, payload: { id } });
        },
        removeAllRoutes: () => {
            dispatch({ type: StoreActionType.RemoveAllRoutes });
        },
        openStop: (stop: Stop) => {
            dispatch({ type: StoreActionType.SetStop, payload: { stop } });
        },
        closeStop: () => {
            dispatch({ type: StoreActionType.SetStop, payload: { stop: null } });
        },
        setCurrentLocation: (location: Point) => {
            dispatch({ type: StoreActionType.SetCurrentLocation, payload: { location } });
        },
        setVehicleRoutes: (route: Set<string>) => {
            dispatch({ type: StoreActionType.SetVehicleRoutes, payload: { route } });
        },
        openSettings: () => {
            dispatch({ type: StoreActionType.SetSettingsDrawer, payload: { open: true } });
        },
        closeSettings: () => {
            dispatch({ type: StoreActionType.SetSettingsDrawer, payload: { open: false } });
        },
        setColorMode: (mode: ColorMode) => {
            dispatch({ type: StoreActionType.SetColorMode, payload: { mode } });
        },
        setLocale: (locale: Locale) => {
            localStorage.setItem(LocaleKey, locale);

            dispatch({ type: StoreActionType.SetLocale, payload: { locale } });
        },
        openIdleAlert: () => {
            dispatch({ type: StoreActionType.SetIdleAlert, payload: { open: true } });
        },
        closeIdleAlert: () => {
            dispatch({ type: StoreActionType.SetIdleAlert, payload: { open: false } });
        },
    };

    return [useStoreState(), actionApis];
};
