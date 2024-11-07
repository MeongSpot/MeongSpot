import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import useAuthStore from '@/store/useAuthStore';

// 커스텀 config 타입 정의
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

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

// 환경에 따른 baseURL 설정
const getBaseUrl = () => {
  if (import.meta.env.DEV) {
    // 개발 환경
    return '/api';
  }
  // 배포 환경
  return '/';
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  },
  validateStatus: function (status) {
    return status >= 200 && status < 300;
  },
  withCredentials: true,
});

// 토큰 재발급 함수
const refreshAccessToken = async (): Promise<string> => {
  try {
    const refreshAxios = axios.create({
      baseURL: import.meta.env.DEV ? '/api' : 'https://meongspot.kro.kr',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const refreshResponse = await refreshAxios.post<ApiResponse>('/api/auth/refresh');

    if (refreshResponse.data.code === 'AU103') {
      const newToken = refreshResponse.headers['authorization'];
      if (newToken) {
        const formattedToken = newToken.startsWith('Bearer ') ? newToken : `Bearer ${newToken}`;
        useAuthStore.getState().setAccessToken(formattedToken);
        return formattedToken;
      }
    }
    throw new Error('Failed to refresh token');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data.code === 'AU005') {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    throw error;
  }
};

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig): CustomAxiosRequestConfig => {
    const token = useAuthStore.getState().getAccessToken();
    if (token && config.url !== '/api/auth/refresh') {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 로그인 성공 시 토큰 저장
    if (response.config.url?.endsWith('/api/auth/login') && response.data.code === 'AU100') {
      const authToken = response.headers['authorization'];
      if (authToken && response.config.data) {
        const { loginId } = JSON.parse(response.config.data);
        const formattedToken = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
        useAuthStore.getState().login(loginId, formattedToken);
      }
    }

    // AU003: 액세스 토큰 만료 - 재발급 필요
    if (response.data.code === 'AU003') {
      const originalRequest = response.config as CustomAxiosRequestConfig;
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        return refreshAccessToken().then((newToken) => {
          originalRequest.headers['Authorization'] = newToken;
          return axiosInstance(originalRequest);
        });
      }
    }

    return response;
  },
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const errorCode = error.response?.data.code;

    // AU003: 액세스 토큰 만료 시 재발급 요청
    if (errorCode === 'AU003' && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers['Authorization'] = newToken;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    // AU004 또는 AU005: 인증 실패나 리프레시 토큰 만료
    if (errorCode === 'AU004' || errorCode === 'AU005') {
      useAuthStore.setState({
        token: null,
        loginId: null,
        isAuthenticated: false,
      });
      localStorage.removeItem('auth-store');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
