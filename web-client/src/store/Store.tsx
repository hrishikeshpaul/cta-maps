import React, { createContext, FunctionComponent, ReactNode, useReducer, useContext, Dispatch } from 'react';

import { StoreState } from './Store.Types';

export enum StoreActionType {
    SetRouteSelect,
    SetDragging,
}

interface PayloadSetRouteSelect {
    open: boolean;
}

interface PayloadSetDragging {
    dragging: boolean;
}

interface StoreAction {
    type: StoreActionType;
    payload: PayloadSetRouteSelect | PayloadSetDragging;
}

interface StoreProviderProps {
    children: ReactNode;
}

export const initialStoreState: StoreState = {
    routeSelectOpen: false,
    dragging: false,
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
    };

    return [useStoreState(), actionApis];
};
