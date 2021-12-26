import { useToast } from '@chakra-ui/react';
import React, { createContext, FunctionComponent, ReactNode, useReducer, useContext, Dispatch } from 'react';

import { getPattern, getRoutes } from './Service';
import { Route, StoreState, Pattern } from './Store.Types';

export enum StoreActionType {
    SetRouteSelect,
    SetDragging,
    SetRoutesLoading,
    SetRoute,
    SetPatternLoading,
    SetPattern,
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

interface StoreAction {
    type: StoreActionType;
    payload?:
        | PayloadSetRouteSelect
        | PayloadSetDragging
        | PayloadRoutesLoading
        | PayloadSetRoute
        | PayloadRemoveRoute
        | PayloadPatternLoading
        | PayloadSetPattern;
}

interface StoreProviderProps {
    children: ReactNode;
}

export const initialStoreState: StoreState = {
    routeSelectOpen: false,
    dragging: false,
    routesLoading: false,
    patternLoading: false,
    routes: [],
    patterns: [],
    error: undefined,
};

const StoreStateContext = createContext<StoreState | undefined>(undefined);
const StoreDispatchContext = createContext<Dispatch<StoreAction> | undefined>(undefined);

const storeReducer = (store: StoreState, action: StoreAction): StoreState => {
    switch (action.type) {
        case StoreActionType.SetRouteSelect:
            return { ...store, routeSelectOpen: (action.payload as PayloadSetRouteSelect).open };
        case StoreActionType.SetDragging:
            return { ...store, dragging: (action.payload as PayloadSetDragging).dragging };
        case StoreActionType.SetRoutesLoading:
            return { ...store, routesLoading: (action.payload as PayloadRoutesLoading).loading };
        case StoreActionType.SetRoute:
            return { ...store, routes: [...store.routes, { ...(action.payload as PayloadSetRoute).route }] };
        case StoreActionType.RemoveRoute:
            const { id } = action.payload as PayloadRemoveRoute;
            const updatedRoutes = store.routes.filter((route) => route.route !== id);
            const updatedPatterns = store.patterns.filter((pattern) => pattern.route !== id);
            
            return { ...store, routes: [...updatedRoutes], patterns: [...updatedPatterns] };
        case StoreActionType.RemoveAllRoutes:
            return { ...store, routes: [], patterns: [] };
        case StoreActionType.SetPatternLoading:
            return {
                ...store,
                patternLoading: (action.payload as PayloadPatternLoading).loading,
            };
        case StoreActionType.SetPattern:
            return {
                ...store,
                patterns: [...store.patterns, ...(action.payload as PayloadSetPattern).pattern],
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
}

export const useStore = (): [StoreState, StoreActionApis] => {
    const dispatch = useStoreDispatch();
    const state = useStoreState();
    const toast = useToast();

    const actionApis: StoreActionApis = {
        openRouteSelect: () => {
            dispatch({ type: StoreActionType.SetRouteSelect, payload: { open: true } });
        },
        closeRouteSelect: async () => {
            dispatch({ type: StoreActionType.SetRouteSelect, payload: { open: false } });
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
                console.log(err.response.data);
            }
        },
        removeRoute: (id: string) => {
            dispatch({ type: StoreActionType.RemoveRoute, payload: { id } });
            // remove pattern from store
        },
        removeAllRoutes: () => {
            dispatch({ type: StoreActionType.RemoveAllRoutes });
        },
    };

    return [useStoreState(), actionApis];
};
