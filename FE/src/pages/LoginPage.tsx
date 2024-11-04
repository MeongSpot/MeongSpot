import { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import BoxInput from '@/components/common/Input/BoxInput';
import PrimaryButton from '@/components/common/Button/PrimaryButton';
import { Link } from 'react-router-dom';
import Mascot from '@/components/common/Logo/Mascot';
import LogoText from '@/components/common/Logo/LogoText';
import { useAuth } from '@/hooks/useAuth';
import LoadingOverlay from '@/components/common/LoadingOverlay';

const LoginPage = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId || !password) {
      return;
    }
    await login(loginId, password);
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

            {error && (
              <div className="text-sm text-red-500 px-1">
                {error}
              </div>
            )}

            <div className="pt-2">
              <PrimaryButton 
                type="submit"
                className={buttonClassName}
                disabled={isLoading}
              >
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