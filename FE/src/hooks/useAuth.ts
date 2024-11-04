import { useState } from 'react';
import { authService } from '@/services/authService';
import { debounce } from 'lodash';
import { useCallback } from 'react';
import { REGEX } from '@/types/signup';

export const useAuth = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [phoneValidationMessage, setPhoneValidationMessage] = useState('');
  const [isPhoneAvailable, setIsPhoneAvailable] = useState(false);

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

  return {
    isValidating,
    validationMessage,
    phoneValidationMessage,
    isPhoneAvailable,
    checkLoginId,
    checkNickname,
    checkPhone,
  };
};
