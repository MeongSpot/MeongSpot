import { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import BoxInput from '@/components/common/Input/BoxInput';
import PrimaryButton from '@/components/common/Button/PrimaryButton';
import { Link } from 'react-router-dom';
import Mascot from '@/components/common/Logo/Mascot';
import LogoText from '@/components/common/Logo/LogoText';

const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login attempt:', { userId, password });
  };

  const inputClassName = "py-4"; // BoxInput의 높이 조절
  const buttonClassName = "py-4"; // PrimaryButton의 높이 조절

  return (
    <div className="auth-content flex h-full items-center justify-center bg-cream-bg">
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
          <div className="w-full space-y-6 pt-8">
            <BoxInput
              label="아이디"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
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
            
            <div className="pt-2">
              <PrimaryButton 
                onClick={handleLogin}
                className={buttonClassName}
              >
                로그인
              </PrimaryButton>
            </div>

            <div className="flex justify-between text-sm text-gray-600 px-1">
              <p>
                아직 계정이 없으신가요?
              </p>
              <Link to="/signup" className="hover:text-deep-coral">
                회원 가입
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;