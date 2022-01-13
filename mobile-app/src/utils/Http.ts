import axios from 'axios';

import { REACT_APP_BASE_URL } from '@env';

export const Http = axios.create({
    baseURL: `https://9a3b-2601-240-c501-ea70-9c67-177-97be-a1bf.ngrok.io/v1/api`,
});
