import axios from 'axios';

import { REACT_APP_BASE_URL } from '@env';

export const Http = axios.create({
    baseURL: `http://6d89-2601-240-c501-ea70-b051-543b-304e-82f5.ngrok.io/v1/api`,
});
