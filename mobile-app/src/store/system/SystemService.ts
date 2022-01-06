import { AppStatus } from './SystemStore.Types';
import { Http } from '../../utils/Http';

interface LocaleResponse {
    data: string;
    status: number;
}

export const getAppStatus = async (): Promise<AppStatus> => {
    const { data } = await Http.get<AppStatus>('/app-status');

    return data;
};

export const getLocaleJson = async (url: string): Promise<LocaleResponse> => {
    const { data, status } = await Http.get(url);

    return { data, status };
};

export const getVersion = async (): Promise<string> => {
    const { data } = await Http.get('/version');

    return data;
};
