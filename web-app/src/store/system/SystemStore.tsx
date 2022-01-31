import { createContext, FunctionComponent, ReactNode, useReducer, useContext, Dispatch } from 'react';

import { Locale } from 'i18n/LocaleProvider';
import {
    SystemStoreState,
    ColorMode,
    ColorModeKey,
    LocaleKey,
    AllowLocationKey,
    ShowActiveRoutesKey,
    BusIconType,
    BusIconKey,
} from 'store/system/SystemStore.Types';

export enum SystemStoreActionType {
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
    SetFavoritesDrawer,
    SetInspectorDrawer,
    SetShowActiveRoutes,
    SetBusIcon,
    SetUIScrollTop,
    ToggleLocationButtonPress,
}

interface PayloadSetBusIcon {
    icon: BusIconType;
}

interface PayloadSetShowActiveRoutes {
    show: boolean;
}

interface PayloadSetInspectorDrawer {
    open: boolean;
}

interface PayloadSetFavoritesDrawer {
    open: boolean;
}
interface PayloadToggleLocationButtonPress {
    value: boolean;
}

interface PayloadSetRoutesLoading {
    loading: boolean;
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

interface PayloadSetUIScrollTop {
    scroll: number | undefined;
}

interface SystemStoreAction {
    type: SystemStoreActionType;
    payload?:
        | PayloadSetDragging
        | PayloadPatternLoading
        | PayloadSetInfoDrawer
        | PayloadSetSettingsDrawer
        | PayloadSetColorMode
        | PayloadSetLocale
        | PayloadSetIdleAlert
        | PayloadSetSystemLoading
        | PayloadSetAllowLocation
        | PayloadToggleLocationButtonPress
        | PayloadSetFavoritesDrawer
        | PayloadSetInspectorDrawer
        | PayloadSetShowActiveRoutes
        | PayloadSetBusIcon
        | PayloadSetUIScrollTop;
}

interface SystemStoreProviderProps {
    children: ReactNode;
}

export const initialStoreState: SystemStoreState = {
    inspectorOpen: false,
    systemLoading: true,
    dragging: false,
    routesLoading: false,
    patternLoading: false,
    onCurrentLocationPress: false,
    settings: {
        colorMode: (localStorage.getItem(ColorModeKey) as ColorMode) || ColorMode.Light,
        locale: (localStorage.getItem(LocaleKey) as Locale) || Locale.EN,
        allowLocation: JSON.parse(localStorage.getItem(AllowLocationKey) || '{}') === true,
        showActiveRoutes: JSON.parse(localStorage.getItem(ShowActiveRoutesKey) || '{}') === true,
        busIcon: (localStorage.getItem(BusIconKey) || BusIconType.Circle) as BusIconType,
    },
    ui: {
        scrollTop: 0,
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
        case SystemStoreActionType.SetDragging:
            return { ...state, dragging: (action.payload as PayloadSetDragging).dragging };
        case SystemStoreActionType.SetPatternLoading:
            return {
                ...state,
                patternLoading: (action.payload as PayloadPatternLoading).loading,
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
        case SystemStoreActionType.ToggleLocationButtonPress: {
            return {
                ...state,
                onCurrentLocationPress: (action.payload as PayloadToggleLocationButtonPress).value,
            };
        }
        case SystemStoreActionType.SetInspectorDrawer: {
            return {
                ...state,
                inspectorOpen: (action.payload as PayloadSetInspectorDrawer).open,
            };
        }
        case SystemStoreActionType.SetShowActiveRoutes: {
            return {
                ...state,
                settings: { ...state.settings, showActiveRoutes: (action.payload as PayloadSetShowActiveRoutes).show },
            };
        }
        case SystemStoreActionType.SetBusIcon: {
            return {
                ...state,
                settings: { ...state.settings, busIcon: (action.payload as PayloadSetBusIcon).icon },
            };
        }
        case SystemStoreActionType.SetUIScrollTop: {
            return {
                ...state,
                ui: {
                    ...state.ui,
                    scrollTop: (action.payload as PayloadSetUIScrollTop).scroll || 0,
                },
            };
        }
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
    setDragging: (value: boolean) => void;
    setColorMode: (mode: ColorMode) => void;
    setLocale: (locale: Locale) => void;
    setSystemLoading: (loading: boolean) => void;
    setAllowLocation: (allow: boolean) => void;
    onLocationButtonPress: (value: boolean) => void;
    openInspector: () => void;
    closeInspector: () => void;
    setShowActiveRoutes: (show: boolean) => void;
    setBusIcon: (icon: BusIconType) => void;
    setUIScrollTop: (scroll: number | undefined) => void;
}

export const useSystemStore = (): [SystemStoreState, SystemStoreActionApis] => {
    const dispatch = useSystemStoreDispatch();

    const actionApis: SystemStoreActionApis = {
        setDragging: (dragging: boolean) => {
            dispatch({ type: SystemStoreActionType.SetDragging, payload: { dragging } });
        },

        setColorMode: (mode: ColorMode) => {
            dispatch({ type: SystemStoreActionType.SetColorMode, payload: { mode } });
        },
        setLocale: (locale: Locale) => {
            localStorage.setItem(LocaleKey, locale);
            dispatch({ type: SystemStoreActionType.SetLocale, payload: { locale } });
        },
        setSystemLoading: (loading: boolean) => {
            dispatch({ type: SystemStoreActionType.SetSystemLoading, payload: { loading } });
        },
        setAllowLocation: (allow: boolean) => {
            localStorage.setItem(AllowLocationKey, JSON.stringify(allow));
            dispatch({ type: SystemStoreActionType.SetAllowLocation, payload: { allow } });
        },
        onLocationButtonPress: (value: boolean) => {
            dispatch({ type: SystemStoreActionType.ToggleLocationButtonPress, payload: { value } });
        },
        openInspector: () => {
            dispatch({ type: SystemStoreActionType.SetInspectorDrawer, payload: { open: true } });
        },
        closeInspector: () => {
            dispatch({ type: SystemStoreActionType.SetInspectorDrawer, payload: { open: false } });
        },
        setShowActiveRoutes: (show: boolean) => {
            localStorage.setItem(ShowActiveRoutesKey, JSON.stringify(show));
            dispatch({ type: SystemStoreActionType.SetShowActiveRoutes, payload: { show } });
        },
        setBusIcon: (icon: BusIconType) => {
            localStorage.setItem(BusIconKey, icon);
            dispatch({ type: SystemStoreActionType.SetBusIcon, payload: { icon } });
        },
        setUIScrollTop: (scroll: number | undefined) => {
            dispatch({ type: SystemStoreActionType.SetUIScrollTop, payload: { scroll } });
        },
    };

    return [useSystemStoreState(), actionApis];
};
