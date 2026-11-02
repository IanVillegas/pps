import { getToken } from '@/sad-aml-shared/utils/TokenStorage';
import { type AxiosInstance, type AxiosRequestConfig } from 'axios';

export const attachInterceptors = (client: AxiosInstance) => {
  client.interceptors.request.use(
    config => {
      const token = getToken();

      setCustomHeaders(config, {
        'x-client-id': 'frontend-archetype', // <- nuevo header
      });

      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    error => Promise.reject(error)
  );

  client.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        // console.warn('401 Unauthorized - Redirigir o limpiar sesión');
        // Aquí podrías redirigir a login o eliminar token
      }
      return Promise.reject(error);
    }
  );
};

export const setCustomHeaders = (
  config: AxiosRequestConfig,
  headers: Record<string, string>
) => {
  config.headers = {
    ...config.headers,
    ...headers,
  };
};
