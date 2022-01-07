import axios from 'axios';

import { REACT_APP_BASE_URL } from '@env';

export const Http = axios.create({
    baseURL: `${REACT_APP_BASE_URL}/v1/api`,
});
