import axiosInstance from '@/services/axiosInstance';
import type { ValidationResponse, AuthResponse, SignupRequest } from '@/types/auth';
import type { SignupData } from '@/types/signup';
import axios from 'axios';
import { getToken } from 'firebase/messaging';
import { messaging } from '@/firebaseConfig';  // Firebase 초기화 설정
import useAuthStore from '@/store/useAuthStore';

interface LoginResponse {
  code: string;
  message: string;
  data: null;
}

interface LoginRequest {
  loginId: string;
  password: string;
}

export const authService = {
  checkLoginIdAvailability: async (loginId: string): Promise<ValidationResponse> => {
    try {
      const response = await axiosInstance.get(`/api/members/check-id`, {
        params: { loginId },
      });

      return { isAvailable: true, message: '사용 가능한 아이디입니다.' };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { code } = error.response.data;
        switch (code) {
          case 'ME000':
            return { isAvailable: false, message: '이미 사용 중인 아이디입니다.' };
          case 'CN000':
            return { isAvailable: false, message: '유효하지 않은 아이디입니다.' };
          default:
            return { isAvailable: false, message: '아이디 확인 중 오류가 발생했습니다.' };
        }
      }
      throw error;
    }
  },

  checkNicknameAvailability: async (nickname: string): Promise<ValidationResponse> => {
    try {
      const response = await axiosInstance.get(`/api/members/check-nickname`, {
        params: { nickname },
      });

      return { isAvailable: true, message: '사용 가능한 닉네임입니다.' };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { code } = error.response.data;
        switch (code) {
          case 'ME001':
            return { isAvailable: false, message: '이미 사용 중인 닉네임입니다.' };
          case 'CN000':
            return { isAvailable: false, message: '유효하지 않은 닉네임입니다.' };
          default:
            return { isAvailable: false, message: '닉네임 확인 중 오류가 발생했습니다.' };
        }
      }
      throw error;
    }
  },

  checkPhoneAvailability: async (phone: string): Promise<ValidationResponse> => {
    try {
      const response = await axiosInstance.get(`/api/members/check-phone`, {
        params: { phone },
      });

      return { isAvailable: true, message: '사용 가능한 전화번호입니다.' };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { code } = error.response.data;
        switch (code) {
          case 'ME002':
            return { isAvailable: false, message: '이미 사용 중인 전화번호입니다.' };
          case 'CN000':
            return { isAvailable: false, message: '유효하지 않은 전화번호입니다.' };
          default:
            return { isAvailable: false, message: '전화번호 확인 중 오류가 발생했습니다.' };
        }
      }
      throw error;
    }
  },

  requestPhoneVerification: async (phone: string): Promise<{ isSuccess: boolean; message: string }> => {
    try {
      await axiosInstance.post('/api/members/phone-verification', { phone });
      return { isSuccess: true, message: '인증번호가 발송되었습니다.' };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        return { isSuccess: false, message: '인증번호 발송에 실패했습니다.' };
      }
      throw error;
    }
  },

  sendPhoneAuthCode: async (phone: string): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post('/api/auth/phone/send-auth-code', {
        phone: phone.replace(/-/g, ''),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        return { code: '400', message: '전화 인증 코드 전송 실패', data: null };
      }
      throw error;
    }
  },

  verifyPhoneAuthCode: async (phone: string, authCode: string): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post('/api/auth/phone/verify-auth-code', {
        phone: phone.replace(/-/g, ''),
        authCode,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        return { code: '400', message: '전화 인증 코드 확인 실패', data: null };
      }
      throw error;
    }
  },

  // 회원가입 메서드 추가
  signup: async (data: SignupData, uuid: string): Promise<AuthResponse> => {
    try {
      const { birth } = data.info;
      const formattedBirth = `${birth.year}-${birth.month.padStart(2, '0')}-${birth.day.padStart(2, '0')}`;

      const requestData = {
        loginId: data.id,
        password: data.password,
        name: data.info.name,
        nickname: data.info.nickname,
        birth: formattedBirth,
        phone: data.info.phone.replace(/-/g, ''),
        gender: data.info.gender === 'male' ? 'MALE' : 'FEMALE',
        uuid: uuid,
      };

      const response = await axiosInstance.post('/api/members', requestData);
      return response.data;
    } catch (error) {
      // 필요 없으므로 제거
      throw error;
    }
  },

  login: async (loginId: string, password: string, token:string): Promise<LoginResponse> => {
    try {
      const response = await axiosInstance.post('/api/auth/login', {
        loginId,
        password,
      });

      // 응답 헤더에서 토큰 추출하여 AxiosInstance에 설정
      const authToken = response.headers['authorization'];
      if (authToken) {
        axiosInstance.defaults.headers.common['Authorization'] = authToken;
      }

      // 로그인 후 FCM 토큰을 가져오고 서버에 저장
      await authService.saveFCMToken(token); // `authService.saveFCMToken`을 호출

      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  // FCM 토큰 저장 메서드
  saveFCMToken: async (token:string) => {
    try {
      // Firebase에서 FCM 토큰을 가져옴
      const fcmToken = await getToken(messaging, { vapidKey: import.meta.env.VITE_PUBLIC_VAPID_KEY });

      if (fcmToken) {
        // 서버로 FCM 토큰 저장 요청
        useAuthStore.getState().setFcmToken(fcmToken);
        const response = await axiosInstance.post('/api/notifications/fcm', { token: fcmToken });

        if (response.data.code === "NO104") {
          console.log('FCM 토큰이 성공적으로 저장되었습니다.');
        } else {
          console.error('FCM 토큰 저장 실패:', response.data.message);
        }
      } else {
        console.error('FCM 토큰을 가져올 수 없습니다.');
      }
    } catch (error) {
      console.error('FCM 토큰 저장 중 오류 발생:', error);
    }
  },

  logout: async (): Promise<{ code: string; message: string }> => {
    try {
      const response = await axiosInstance.post('/api/auth/logout');
      return response.data;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  },
};
