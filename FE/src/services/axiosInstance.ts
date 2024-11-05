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
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  },
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  },
  withCredentials: true,
});

// 토큰 재발급 함수
const refreshAccessToken = async (): Promise<string> => {
  try {
    const refreshResponse = await axios.post<ApiResponse>(
      `${getBaseUrl()}/api/auth/refresh`,
      {},
      {
        withCredentials: true,
      }
    );

    if (refreshResponse.data.code === 'AU103') {
      const newToken = refreshResponse.headers['authorization'];
      if (newToken) {
        const formattedToken = newToken.startsWith('Bearer ')
          ? newToken
          : `Bearer ${newToken}`;
        useAuthStore.getState().login(useAuthStore.getState().loginId!, formattedToken);
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
    const token = useAuthStore.getState().token;
    if (token) {
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
    if (response.config.url?.endsWith('/api/auth/login') && response.data.code === 'AU100') {
      const authToken = response.headers['authorization'];
      if (authToken && response.config.data) {
        const { loginId } = JSON.parse(response.config.data);
        const formattedToken = authToken.startsWith('Bearer ')
          ? authToken
          : `Bearer ${authToken}`;
        useAuthStore.getState().login(loginId, formattedToken);
      }
    }
    return response;
  },
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // 액세스 토큰 만료
    if (error.response?.data.code === 'AU003' && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers['Authorization'] = newToken;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    // 액세스 토큰 인증 실패
    if (error.response?.data.code === 'AU004') {
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;