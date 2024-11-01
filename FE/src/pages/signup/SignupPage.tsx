import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import { AnimatePresence, motion } from 'framer-motion';
import AuthStep from '@/pages/signup/AuthStep';
import InfoStep from '@/pages/signup/InfoStep';
import CompleteStep from '@/pages/signup/CompleteStep';
import FooterButton from '@/components/common/Button/FooterButton';
import { SignupData } from '@/types/signup';
import { REGEX } from '@/types/signup';

const SignupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [direction, setDirection] = useState(1);

  const [signupData, setSignupData] = useState<SignupData>({
    id: '',
    password: '',
    info: {
      name: '',
      nickname: '',
      phone: '',
      birth: {
        year: '',
        month: '',
        day: '',
      },
      gender: null,
    },
  });
  const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);

  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const handleBack = () => {
    const currentPath = location.pathname;
    setDirection(-1);
    if (currentPath.includes('info')) {
      setSignupData((prev) => ({
        ...prev,
        info: {
          name: '',
          nickname: '',
          phone: '',
          birth: {
            year: '',
            month: '',
            day: '',
          },
          gender: null,
        },
      }));
      navigate('/signup/auth');
    } else if (currentPath.includes('auth')) {
      navigate('/login');
    }
  };

  const handleNext = () => {
    setDirection(1);
    const currentPath = location.pathname;
    if (currentPath.includes('auth')) {
      navigate('/signup/info');
    } else if (currentPath.includes('info')) {
      navigate('/signup/complete');
    } else if (currentPath.includes('complete')) {
      navigate('/login');
    }
  };

  const isFormValid = () => {
    const currentPath = location.pathname;
    if (currentPath.includes('auth')) {
      const idRegex = REGEX.ID;
      const passwordLengthValid = signupData.password.length >= 8 && signupData.password.length <= 16;
      const passwordCharValid = REGEX.PASSWORD.test(signupData.password);
      const isIdValid = idRegex.test(signupData.id);
      const isPasswordValid = passwordLengthValid && passwordCharValid;
      return isIdValid && isPasswordValid && isDuplicateChecked;
    } else if (currentPath.includes('info')) {
      const isValidYear = (year: string) => {
        const yearNum = parseInt(year);
        return year.length === 4 && yearNum <= new Date().getFullYear();
      };
      return (
        signupData.info.name &&
        signupData.info.nickname &&
        isNicknameChecked &&
        signupData.info.phone &&
        isPhoneVerified &&
        isValidYear(signupData.info.birth.year) &&
        signupData.info.birth.year &&
        signupData.info.birth.month &&
        signupData.info.birth.day &&
        signupData.info.gender
      );
    }
    return false;
  };

  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
    }),
    center: {
      x: 0,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
    }),
  };

  const pageTransition = {
    type: 'tween',
    duration: 0.2,
  };

  const showHeader = !location.pathname.includes('complete');
  const showFooter = true; // 완료 페이지에서도 버튼 표시

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* {showHeader && ( */}
      <div className="flex h-16 items-center border-b">
        <button onClick={handleBack} className="px-2">
          {showHeader && <IoChevronBack size={24} />}
        </button>
      </div>
      {/* )} */}

      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={location.pathname}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pageTransition}
            className="w-full h-full absolute"
          >
            {location.pathname === '/signup/auth' && (
              <AuthStep
                formData={signupData}
                setFormData={setSignupData}
                isDuplicateChecked={isDuplicateChecked}
                setIsDuplicateChecked={setIsDuplicateChecked}
              />
            )}
            {location.pathname === '/signup/info' && (
              <InfoStep
                formData={signupData}
                setFormData={setSignupData}
                isNicknameChecked={isNicknameChecked}
                setIsNicknameChecked={setIsNicknameChecked}
                isPhoneVerified={isPhoneVerified}
                setIsPhoneVerified={setIsPhoneVerified}
              />
            )}
            {location.pathname === '/signup/complete' && <CompleteStep />}
          </motion.div>
        </AnimatePresence>
      </div>

      {showFooter && (
        <div className="fixed bottom-0 left-0 right-0 max-w-[576px] mx-auto">
          <FooterButton onClick={handleNext} disabled={!location.pathname.includes('complete') && !isFormValid()}>
            {location.pathname.includes('auth')
              ? '다음'
              : location.pathname.includes('complete')
                ? '로그인하기'
                : '가입하기'}
          </FooterButton>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="auth" replace />} />
      </Routes>
    </div>
  );
};

export default SignupPage;
