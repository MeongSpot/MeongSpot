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
  // 개발 환경에서는 proxy를 통해 요청이 전달되도록
  if (import.meta.env.DEV) {
    return '/api';
  }
  return '/'; // 다시 상대 경로로 변경
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  validateStatus: function (status) {
    return status >= 200 && status < 300;
  },
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// 토큰 재발급 함수
const refreshAccessToken = async (): Promise<string> => {
  try {
    const response = await axiosInstance.post<ApiResponse>('/api/auth/refresh'); // axiosInstance 사용

    console.log('Refresh Response:', response);

    const newToken = response.headers['authorization'];
    if (response.data.code === 'AU103' && newToken) {
      const formattedToken = newToken.startsWith('Bearer ') ? newToken : `Bearer ${newToken}`;
      useAuthStore.getState().setAccessToken(formattedToken);
      return formattedToken;
    }

    throw new Error('Invalid token refresh response');
  } catch (error) {
    console.error('Refresh Token Error:', error);
    throw error;
  }
};

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig): CustomAxiosRequestConfig => {
    const token = useAuthStore.getState().getAccessToken();
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
    // 로그인 성공 (200 OK & AU100)
    if (response.config.url?.endsWith('/auth/login') && response.data.code === 'AU100') {
      const authToken = response.headers['authorization'];
      if (authToken && response.config.data) {
        const { loginId } = JSON.parse(response.config.data);
        const formattedToken = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
        useAuthStore.getState().login(loginId, formattedToken);

        // 더 자세한 쿠키 정보 로깅
        console.log('Login Response Cookies:', {
          all: document.cookie,
          headers: response.headers,
          'set-cookie': response.headers['set-cookie'],
        });
      }
    }
    return response;
  },
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    if (!originalRequest || !error.response) {
      return Promise.reject(error);
    }

    const errorResponse = error.response.data;

    // 액세스 토큰 만료 (401 & AU003) 또는 액세스 토큰 인증 실패 (401 & AU004)
    if (
      error.response.status === 401 &&
      (errorResponse?.code === 'AU003' || errorResponse?.code === 'AU004') &&
      !originalRequest._retry
    ) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          isRefreshing = false;
          onRefreshed(newToken);
          originalRequest._retry = true;
          originalRequest.headers['Authorization'] = newToken;
          return axiosInstance(originalRequest);
        } catch (error) {
          isRefreshing = false;
          return Promise.reject(error);
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

    // 리프레시 토큰 인증 실패 (401 & AU005)일 때만 로그아웃
    if (error.response.status === 401 && errorResponse?.code === 'AU005') {
      // useAuthStore.setState({
      //   token: null,
      //   loginId: null,
      //   isAuthenticated: false,
      // });
      // localStorage.removeItem('auth-store');
      // window.location.href = '/login';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
