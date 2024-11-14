import { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import BoxInput from '@/components/common/Input/BoxInput';
import PrimaryButton from '@/components/common/Button/PrimaryButton';
import { Link } from 'react-router-dom';
import Mascot from '@/components/common/Logo/Mascot';
import LogoText from '@/components/common/Logo/LogoText';
import { useAuth } from '@/hooks/useAuth';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { getToken } from 'firebase/messaging'; // Firebase getToken 함수 임포트
import { messaging } from '@/firebaseConfig'; // Firebase messaging 설정 임포트
import { authService } from '@/services/authService'; // 서비스에서 FCM 토큰 저장 로직 처리

const LoginPage = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth(); // 로그인 관련 훅
  const [fcmToken, setFcmToken] = useState<string | null>(null); // FCM 토큰 상태

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId || !password) {
      return;
    }
  
    try {
      let token: string | null = null;
  
      // 알림 권한 상태 확인 및 FCM 토큰 요청
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_PUBLIC_VAPID_KEY,
          });
        } else {
          console.warn('알림 권한이 거부되었습니다. FCM 토큰 없이 로그인합니다.');
        }
      } else if (Notification.permission === 'granted') {
        token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_PUBLIC_VAPID_KEY,
        });
      } else {
        console.warn('알림 권한이 차단되었습니다. FCM 토큰 없이 로그인합니다.');
      }
  
      // 로그인 요청
      if (token) {
        await login(loginId, password, token); // token이 있을 때만 전달
        await authService.saveFCMToken(token); // FCM 토큰이 있는 경우에만 서버에 저장
      } else {
        await login(loginId, password); // token 없이 로그인 호출
      }
    } catch (error) {
      console.error('로그인 과정에서 오류 발생:', error);
    }
  };
  

  const inputClassName = 'py-4';
  const buttonClassName = 'py-4';

  return (
    <div className="auth-content flex h-full items-center justify-center bg-cream-bg relative">
      {isLoading && <LoadingOverlay message="로그인 중..." />}
      <div className="w-full max-w-sm px-6">
        <div className="flex flex-col items-center">
          {/* 로고 영역 */}
          <div className="text-center">
            <div className="flex justify-center">
              <Mascot className="w-40" />
            </div>
            <div className="mt-1 flex justify-center pr-2">
              <LogoText className="w-32" />
            </div>
          </div>

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit} className="w-full space-y-6 pt-8">
            <BoxInput
              label="아이디"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              icon={FaUser}
              className={inputClassName}
            />
            <BoxInput
              label="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={FaLock}
              showPasswordToggle
              className={inputClassName}
            />

            {error && <div className="text-sm text-red-500 px-1">{error}</div>}

            <div className="pt-2">
              <PrimaryButton type="submit" className={buttonClassName} disabled={isLoading}>
                로그인
              </PrimaryButton>
            </div>

            <div className="flex justify-between text-sm text-gray-600 px-1">
              <p>아직 계정이 없으신가요?</p>
              <Link to="/signup" className="hover:text-deep-coral">
                회원 가입
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
