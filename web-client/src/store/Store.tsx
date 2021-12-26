import React, { createContext, FunctionComponent, ReactNode, useReducer, useContext, Dispatch } from 'react';

import { getRoutes } from './Service';
import { Route, StoreState } from './Store.Types';

export enum StoreActionType {
    SetRouteSelect,
    SetDragging,
    SetRoutesLoading,
    SetRoute,
    RemoveRoute,
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

interface StoreAction {
    type: StoreActionType;
    payload: PayloadSetRouteSelect | PayloadSetDragging | PayloadRoutesLoading | PayloadSetRoute | PayloadRemoveRoute;
}

interface StoreProviderProps {
    children: ReactNode;
}

export const initialStoreState: StoreState = {
    routeSelectOpen: false,
    dragging: false,
    routesLoading: false,
    routes: [],
};

const StoreStateContext = createContext<StoreState | undefined>(undefined);
const StoreDispatchContext = createContext<Dispatch<StoreAction> | undefined>(undefined);

const storeReducer = (store: StoreState, action: StoreAction): StoreState => {
    switch (action.type) {
        case StoreActionType.SetRouteSelect:
            const { open } = action.payload as PayloadSetRouteSelect;
            return { ...store, routeSelectOpen: open };
        case StoreActionType.SetDragging:
            const { dragging } = action.payload as PayloadSetDragging;
            return { ...store, dragging };
        case StoreActionType.SetRoutesLoading:
            const { loading } = action.payload as PayloadRoutesLoading;
            return { ...store, routesLoading: loading };
        case StoreActionType.SetRoute:
            const { route } = action.payload as PayloadSetRoute;
            return { ...store, routes: [...store.routes, { ...route }] };
        case StoreActionType.RemoveRoute:
            const { id } = action.payload as PayloadRemoveRoute;
            const updatedRoutes = store.routes.filter((route) => route.route !== id);
            return { ...store, routes: [...updatedRoutes] };
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
}

export const useStore = (): [StoreState, StoreActionApis] => {
    const dispatch = useStoreDispatch();

    const actionApis: StoreActionApis = {
        openRouteSelect: () => {
            dispatch({ type: StoreActionType.SetRouteSelect, payload: { open: true } });
        },
        closeRouteSelect: () => {
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
            } catch (err) {
                console.log(err);
                dispatch({ type: StoreActionType.SetRoutesLoading, payload: { loading: false } });

                return null;
            }
        },
        setRoute: async (route: Route) => {
            dispatch({ type: StoreActionType.SetRoute, payload: { route } });
            // set the route in store
            // get pattern
        },
        removeRoute: (id: string) => {
            dispatch({ type: StoreActionType.RemoveRoute, payload: { id } });
        },
    };

    return [useStoreState(), actionApis];
};
