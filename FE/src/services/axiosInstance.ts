import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';

interface ApiErrorResponse {
  code: string;
  message: string;
  data: unknown;
}

interface ApiSuccessResponse<T = unknown> {
  code: string;
  message: string;
  data: T;
}

type ApiResponse<T = unknown> = ApiErrorResponse | ApiSuccessResponse<T>;

const axiosInstance: AxiosInstance = axios.create({
  // 프록시 설정에 맞춰 /api로 시작하도록 변경
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
    // CORS 관련 헤더 추가
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  },
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
