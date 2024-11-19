import MascotGlasses from '../../components/common/Logo/MascotGlasses';

const CompleteStep = () => {
  return (
    <div className="auth-content flex h-screen items-center justify-center pb-28 bg-cream-bg">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-3 text-center">회원가입이 완료되었어요!</h2>
        <p className="text-deep-coral text-lg font-bold mb-10 text-center">로그인하여 멍스팟을 이용해보세요</p>
        <MascotGlasses className="w-40" />
      </div>
    </div>
  );
};

export default CompleteStep;
