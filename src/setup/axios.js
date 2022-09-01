import axios from 'axios';
import { API_URL } from '@/constants';

export const Gateway = axios.create({
  baseURL: API_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, HEAD, OPTIONS',
    token: localStorage.getItem('token'),
    withCredentials: true,
  },
  // params: {
  //   token: localStorage.getItem('token'),
  // },
});

export const Gateway2 = axios.create({
  baseURL: API_URL,
  headers: {
    withCredentials: true,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, HEAD, OPTIONS',
  },
  params: {
    token: localStorage.getItem('token'),
  },
});

export const setupInterceptors = () => {
  Gateway.interceptors.response.use(
    (response) => response.data,
    async (error) => Promise.reject(error),
  );
  Gateway2.interceptors.response.use(
    (response) => response,
    async (error) => Promise.reject(error),
  );
};
