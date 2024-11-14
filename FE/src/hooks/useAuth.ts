import { useState } from 'react';
import { authService } from '@/services/authService';
import { debounce } from 'lodash';
import { useCallback } from 'react';
import type { SignupData } from '@/types/signup';
import useAuthStore from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/services/axiosInstance';

export const useAuth = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [phoneValidationMessage, setPhoneValidationMessage] = useState('');
  const [isPhoneAvailable, setIsPhoneAvailable] = useState(false);
  const [authError, setAuthError] = useState('');
  const { setVerificationUuid, verificationUuid } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { logout: storeLogout } = useAuthStore();
  const authStore = useAuthStore();
  const { login: storeLogin } = useAuthStore();

  const checkLoginId = async (loginId: string, onSuccess: (isAvailable: boolean) => void) => {
    if (!loginId) return;

    setIsValidating(true);
    try {
      const result = await authService.checkLoginIdAvailability(loginId);
      setValidationMessage(result.message);
      onSuccess(result.isAvailable);
    } catch (error) {
      setValidationMessage('확인 중 오류가 발생했습니다.');
      onSuccess(false);
    } finally {
      setIsValidating(false);
    }
  };

  const checkNickname = async (nickname: string, onSuccess: (isAvailable: boolean) => void) => {
    if (!nickname) return;

    setIsValidating(true);
    try {
      const result = await authService.checkNicknameAvailability(nickname);
      setValidationMessage(result.message);
      onSuccess(result.isAvailable);
    } catch (error) {
      setValidationMessage('확인 중 오류가 발생했습니다.');
      onSuccess(false);
    } finally {
      setIsValidating(false);
    }
  };

  const checkPhone = useCallback(
    debounce(async (phone: string, onSuccess: (isAvailable: boolean) => void) => {
      if (!phone) return;

      setIsValidating(true);
      try {
        const result = await authService.checkPhoneAvailability(phone);
        setPhoneValidationMessage(result.message);
        setIsPhoneAvailable(result.isAvailable);
        onSuccess(result.isAvailable);
      } catch (error) {
        setPhoneValidationMessage('전화번호 확인 중 오류가 발생했습니다.');
        setIsPhoneAvailable(false);
        onSuccess(false);
      } finally {
        setIsValidating(false);
      }
    }, 300),
    [],
  );

  const sendPhoneAuthCode = async (phone: string): Promise<boolean> => {
    setIsValidating(true);
    try {
      const response = await authService.sendPhoneAuthCode(phone);
      if (response.code === 'AU101') {
        setAuthError('');
        return true;
      }
      setAuthError(response.message);
      return false;
    } catch (error) {
      setAuthError('인증번호 발송에 실패했습니다.');
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const verifyPhoneCode = async (phone: string, code: string): Promise<boolean> => {
    setIsValidating(true);
    try {
      const response = await authService.verifyPhoneAuthCode(phone, code);
      console.log('Verification response:', response);

      if (response.code === 'AU102' && response.data) {
        setVerificationUuid(response.data); // Zustand store에 저장
        setAuthError('');
        return true;
      }
      setAuthError(response.message);
      return false;
    } catch (error) {
      setAuthError('인증번호 확인에 실패했습니다.');
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const signup = async (signupData: SignupData): Promise<boolean> => {
    console.log('Verification UUID from store:', verificationUuid); // 디버깅용

    if (!verificationUuid) {
      console.error('No verification UUID found');
      setAuthError('전화번호 인증이 필요합니다.');
      return false;
    }

    try {
      const { birth } = signupData.info;
      const formattedBirth = `${birth.year}-${birth.month.padStart(2, '0')}-${birth.day.padStart(2, '0')}`;

      const requestData = {
        loginId: signupData.id,
        password: signupData.password,
        name: signupData.info.name,
        nickname: signupData.info.nickname,
        birth: formattedBirth,
        phone: signupData.info.phone.replace(/-/g, ''),
        gender: signupData.info.gender === 'male' ? 'MALE' : 'FEMALE',
        uuid: verificationUuid,
      };

      console.log('Signup request data:', requestData);

      const response = await authService.signup(signupData, verificationUuid);
      console.log('Signup response:', response);

      return response.code === 'ME100';
    } catch (error) {
      console.error('Signup error:', error);
      setAuthError('회원가입에 실패했습니다.');
      return false;
    }
  };


  const login = async (loginId: string, password: string, token?:string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(loginId, password, token);
      const authToken = axiosInstance.defaults.headers.common['Authorization'] as string;
      
      if (response.code === 'AU100' && authToken) {
        storeLogin(loginId, authToken);
        navigate('/');
        return true;
      }
      
      setError(response.message || '로그인에 실패했습니다.');
      return false;
    } catch (error) {
      setError('로그인 중 오류가 발생했습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const response = await authService.logout();
      if (response.code === 'AU104') {
        await storeLogout();
        navigate('/login');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  };

  return {
    isValidating,
    validationMessage,
    phoneValidationMessage,
    isPhoneAvailable,
    checkLoginId,
    checkNickname,
    checkPhone,
    sendPhoneAuthCode,
    verifyPhoneCode,
    signup,
    verificationUuid,
    authError,
    login,
    logout,
    isLoading,
    error,
  };
};
