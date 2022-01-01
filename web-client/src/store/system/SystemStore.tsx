import { createContext, FunctionComponent, ReactNode, useReducer, useContext, Dispatch } from 'react';

import { Locale } from 'i18n/LocaleProvider';
import { SystemStoreState, ColorMode, ColorModeKey, LocaleKey, AllowLocationKey } from 'store/system/SystemStore.Types';

export enum SystemStoreActionType {
    SetRouteSelectDrawer,
    SetDragging,
    SetPatternLoading,
    SetInfoDrawer,
    SetSettingsDrawer,
    SetColorMode,
    SetLocale,
    SetIdleAlert,
    SetSystemLoading,
    SetSettings,
    SetRoutesLoading,
    SetAllowLocation,
}

interface PayloadSetRoutesLoading {
    loading: boolean;
}

interface PayloadSetRouteSelectDrawer {
    open: boolean;
}

interface PayloadSetDragging {
    dragging: boolean;
}

interface PayloadPatternLoading {
    loading: boolean;
}

interface PayloadSetInfoDrawer {
    open: boolean;
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

interface PayloadSetAllowLocation {
    allow: boolean;
}

interface SystemStoreAction {
    type: SystemStoreActionType;
    payload?:
        | PayloadSetDragging
        | PayloadSetRouteSelectDrawer
        | PayloadPatternLoading
        | PayloadSetInfoDrawer
        | PayloadSetSettingsDrawer
        | PayloadSetColorMode
        | PayloadSetLocale
        | PayloadSetIdleAlert
        | PayloadSetSystemLoading
        | PayloadSetAllowLocation;
}

interface SystemStoreProviderProps {
    children: ReactNode;
}

export const initialStoreState: SystemStoreState = {
    systemLoading: true,
    routeSelectOpen: false,
    idleAlertOpen: false,
    dragging: false,
    routesLoading: false,
    patternLoading: false,
    infoOpen: false,
    settingsOpen: false,
    settings: {
        colorMode: (localStorage.getItem(ColorModeKey) as ColorMode) || ColorMode.Light,
        locale: (localStorage.getItem(LocaleKey) as Locale) || Locale.EN,
        allowLocation: JSON.parse(localStorage.getItem(AllowLocationKey) || '{}') === true,
    },
};

const SystemStoreStateContext = createContext<SystemStoreState | undefined>(undefined);
const SystemStoreDispatchContext = createContext<Dispatch<SystemStoreAction> | undefined>(undefined);

const storeReducer = (state: SystemStoreState, action: SystemStoreAction): SystemStoreState => {
    switch (action.type) {
        case SystemStoreActionType.SetRoutesLoading:
            return {
                ...state,
                routesLoading: (action.payload as PayloadSetRoutesLoading).loading,
            };
        case SystemStoreActionType.SetRouteSelectDrawer:
            return { ...state, routeSelectOpen: (action.payload as PayloadSetRouteSelectDrawer).open };
        case SystemStoreActionType.SetDragging:
            return { ...state, dragging: (action.payload as PayloadSetDragging).dragging };
        case SystemStoreActionType.SetPatternLoading:
            return {
                ...state,
                patternLoading: (action.payload as PayloadPatternLoading).loading,
            };
        case SystemStoreActionType.SetInfoDrawer:
            return {
                ...state,
                infoOpen: (action.payload as PayloadSetInfoDrawer).open,
            };
        case SystemStoreActionType.SetSettingsDrawer:
            return {
                ...state,
                settingsOpen: (action.payload as PayloadSetSettingsDrawer).open,
            };
        case SystemStoreActionType.SetColorMode:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    colorMode: (action.payload as PayloadSetColorMode).mode,
                },
            };
        case SystemStoreActionType.SetLocale:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    locale: (action.payload as PayloadSetLocale).locale,
                },
            };
        case SystemStoreActionType.SetIdleAlert:
            return {
                ...state,
                idleAlertOpen: (action.payload as PayloadSetIdleAlert).open,
            };
        case SystemStoreActionType.SetSystemLoading:
            return {
                ...state,
                systemLoading: (action.payload as PayloadSetSystemLoading).loading,
            };
        case SystemStoreActionType.SetAllowLocation:
            return {
                ...state,
                settings: { ...state.settings, allowLocation: (action.payload as PayloadSetAllowLocation).allow },
            };
        default: {
            throw new Error(`Invalid action -- ${action.type}`);
        }
    }
};

export const SystemStoreProvider: FunctionComponent<SystemStoreProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(storeReducer, initialStoreState);

    return (
        <SystemStoreStateContext.Provider value={state}>
            <SystemStoreDispatchContext.Provider value={dispatch}>{children}</SystemStoreDispatchContext.Provider>
        </SystemStoreStateContext.Provider>
    );
};

const useSystemStoreState = (): SystemStoreState => {
    const context = useContext(SystemStoreStateContext);

    if (context === undefined) {
        throw new Error('useSystemStoreState must be used within SystemStoreProvider');
    }

    return context;
};

export const useSystemStoreDispatch = (): Dispatch<SystemStoreAction> => {
    const context = useContext(SystemStoreDispatchContext);

    if (context === undefined) {
        throw new Error('UseStoreState must be used within StoreProvider');
    }

    return context;
};

interface SystemStoreActionApis {
    openRouteSelect: () => void;
    closeRouteSelect: () => void;
    setDragging: (value: boolean) => void;
    openInfoDrawer: () => void;
    closeInfoDrawer: () => void;
    openSettings: () => void;
    closeSettings: () => void;
    setColorMode: (mode: ColorMode) => void;
    setLocale: (locale: Locale) => void;
    openIdleAlert: () => void;
    closeIdleAlert: () => void;
    setSystemLoading: (loading: boolean) => void;
}

export const useSystemStore = (): [SystemStoreState, SystemStoreActionApis] => {
    const dispatch = useSystemStoreDispatch();

    const actionApis: SystemStoreActionApis = {
        openRouteSelect: () => {
            dispatch({ type: SystemStoreActionType.SetRouteSelectDrawer, payload: { open: true } });
        },
        closeRouteSelect: async () => {
            dispatch({ type: SystemStoreActionType.SetRouteSelectDrawer, payload: { open: false } });
        },
        openInfoDrawer: () => {
            dispatch({ type: SystemStoreActionType.SetInfoDrawer, payload: { open: true } });
        },
        closeInfoDrawer: async () => {
            dispatch({ type: SystemStoreActionType.SetInfoDrawer, payload: { open: false } });
        },
        setDragging: (dragging: boolean) => {
            dispatch({ type: SystemStoreActionType.SetDragging, payload: { dragging } });
        },
        openSettings: () => {
            dispatch({ type: SystemStoreActionType.SetSettingsDrawer, payload: { open: true } });
        },
        closeSettings: () => {
            dispatch({ type: SystemStoreActionType.SetSettingsDrawer, payload: { open: false } });
        },
        setColorMode: (mode: ColorMode) => {
            dispatch({ type: SystemStoreActionType.SetColorMode, payload: { mode } });
        },
        setLocale: (locale: Locale) => {
            localStorage.setItem(LocaleKey, locale);
            dispatch({ type: SystemStoreActionType.SetLocale, payload: { locale } });
        },
        openIdleAlert: () => {
            dispatch({ type: SystemStoreActionType.SetIdleAlert, payload: { open: true } });
        },
        closeIdleAlert: () => {
            dispatch({ type: SystemStoreActionType.SetIdleAlert, payload: { open: false } });
        },
        setSystemLoading: (loading: boolean) => {
            dispatch({ type: SystemStoreActionType.SetSystemLoading, payload: { loading } });
        },
    };

    return [useSystemStoreState(), actionApis];
};
