import { Locale } from 'i18n/LocaleProvider';

export const ColorModeKey = 'chakra-ui-color-mode';
export const LocaleKey = 'track-cta-locale';
export const AllowLocationKey = 'track-cta-allow-location';
export const ShowActiveRoutesKey = 'track-cta-show-active-routes';
export const BusIconKey = 'track-cta-bus-icon';

export enum ColorMode {
    Light = 'light',
    Dark = 'dark',
}

export enum BusIconType {
    Circle = 'circle',
    Arrow = 'arrow',
    Teardrop = 'teardrop',
}

export enum SettingsMode {
    On = 'on',
    Off = 'off',
}

export interface Setting {
    colorMode: ColorMode;
    locale: Locale;
    allowLocation: boolean;
    showActiveRoutes: boolean;
    busIcon: BusIconType;
}

export enum Status {
    Success = 'success',
    InProgress = 'in_progress',
    Failure = 'failure',
}

export interface AppStatus {
    web: Status;
    server: Status;
}

export interface SystemStoreState {
    inspectorOpen: boolean;
    onCurrentLocationPress: boolean;
    systemLoading: boolean;
    dragging: boolean;
    routesLoading: boolean;
    patternLoading: boolean;
    settings: Setting;
    ui: {
        scrolledFromTop: boolean;
    };
}
