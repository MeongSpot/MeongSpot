import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import useAuthStore from '@/store/useAuthStore';

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

const getBaseUrl = () => {
  if (import.meta.env.DEV) {
    return '/api';
  }
  return '/';
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  validateStatus: function (status) {
    return status >= 200 && status < 300;
  },
  withCredentials: true,
});

// 토큰 갱신 중복 방지를 위한 변수들
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// 토큰 재발급 함수
const refreshAccessToken = async (): Promise<string> => {
  try {
    const response = await axios.post<ApiResponse>(
      '/api/auth/refresh',
      {},
      {
        baseURL: import.meta.env.DEV ? '/api' : 'https://meongspot.kro.kr',
        withCredentials: true,
        validateStatus: function (status) {
          return status >= 200 && status < 300;
        },
      },
    );

    const newToken = response.headers['authorization'];
    if (newToken) {
      const formattedToken = newToken.startsWith('Bearer ') ? newToken : `Bearer ${newToken}`;
      useAuthStore.getState().setAccessToken(formattedToken);
      return formattedToken;
    }

    throw new Error('No token in refresh response');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().logout();
      // window.location.href = '/login';
    }
    throw error;
  }
};

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig): CustomAxiosRequestConfig => {
    const token = useAuthStore.getState().getAccessToken();
    // refresh 요청이 아닐 때만 토큰 추가
    if (token && !config.url?.includes('/auth/refresh')) {
      config.headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
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
    if (response.config.url?.endsWith('/auth/login') && response.data.code === 'AU100') {
      const authToken = response.headers['authorization'];
      if (authToken && response.config.data) {
        const { loginId } = JSON.parse(response.config.data);
        const formattedToken = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
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

    // 401 에러이고 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          isRefreshing = false;
          onRefreshed(newToken);
          originalRequest._retry = true;
          originalRequest.headers['Authorization'] = newToken;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          if (axios.isAxiosError(refreshError) && refreshError.response?.status === 401) {
            useAuthStore.setState({
              token: null,
              loginId: null,
              isAuthenticated: false,
            });
            localStorage.removeItem('auth-store');
            // window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      } else {
        // 재발급 진행 중인 경우 대기
        return new Promise((resolve) => {
          refreshSubscribers.push((token: string) => {
            originalRequest.headers['Authorization'] = token;
            resolve(axiosInstance(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
