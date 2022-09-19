import axios from 'axios';
import { API_URL } from '@/constants';

export const Gateway = axios.create({
  baseURL: API_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, HEAD, OPTIONS',
    withCredentials: true,
  },
});

export const setupInterceptors = () => {
  Gateway.interceptors.response.use(
    (response) => response.data,
    async (error) => Promise.reject(error),
  );
};
