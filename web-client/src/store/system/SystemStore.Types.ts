import { Locale } from 'i18n/LocaleProvider';

export const ColorModeKey = 'chakra-ui-color-mode';
export const LocaleKey = 'cta-maps-locale';

export enum ColorMode {
    Light = 'light',
    Dark = 'dark',
}

export interface Setting {
    colorMode: ColorMode;
    locale: Locale;
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
    systemLoading: boolean;
    routeSelectOpen: boolean;
    infoOpen: boolean;
    settingsOpen: boolean;
    idleAlertOpen: boolean;
    dragging: boolean;
    routesLoading: boolean;
    patternLoading: boolean;
    settings: Setting;
}
