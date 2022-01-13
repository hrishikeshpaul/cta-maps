import { Http } from 'utils/Http';

interface LocaleResponse {
    data: string;
    status: number;
}

export const getLocaleJson = async (url: string): Promise<LocaleResponse> => {
    const { data, status } = await Http.get(url);

    return { data, status };
};

export const getVersion = async (): Promise<string> => {
    const { data } = await Http.get('/version');

    return data;
};
