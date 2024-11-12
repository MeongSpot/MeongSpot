import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';
import FooterButton from '@/components/common/Button/FooterButton';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { useMyPage } from '@/hooks/mypage/useMyPage';
import BoxInput from '@/components/common/DogInput/DogBoxInput';

const UpdateUser: React.FC = () => {
  const navigate = useNavigate();
  const {
    isUserLoading,
    userData,
    updateProfileImage,
    updateNickname,
    getMyPageUser,
    nickname,
    setNickname,
    profileImage,
    setProfileImage,
  } = useMyPage();

  const [isValid, setIsValid] = useState(false);
  const [profileFile, setProfileFile] = useState<File | null>(null);

  useEffect(() => {
    getMyPageUser();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setProfileFile(file);
    }
  };

  const handleSaveChanges = () => {
    if (profileFile) {
      const formData = new FormData();
      formData.append('profileImage', profileFile);
      updateProfileImage(formData);
    }

    if (nickname !== userData?.nickname) {
      updateNickname(nickname);
    }
  };

  const handleBack = () => {
    navigate('/mypage');
    resetUserInfo();
  };

  const resetUserInfo = () => {
    setProfileImage('');
    setProfileFile(null);
    setNickname('');
  };

  useEffect(() => {
    // 닉네임이 입력되어 있는지 유효성 검사
    setIsValid(nickname.trim() !== '');
  }),
    [nickname];

  return (
    <div className="h-full flex flex-col justify-between">
      {isUserLoading ? (
        <LoadingOverlay message="로딩 중..." />
      ) : (
        <>
          <div>
            <div className="p-4 grid grid-cols-3 items-center">
              <div></div>
              <p className="text-center text-lg font-bold">프로필 수정</p>
              <div className="flex justify-end">
                <IoClose onClick={handleBack} size={24} />
              </div>
            </div>
            <hr />

            {/* 프로필 이미지 등록 */}
            <div className="mt-12">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-24 h-24 relative">
                  <label htmlFor="fileInput">
                    <img
                      src={profileImage || '/icons/imageAddIcon.png'}
                      alt="프로필 이미지"
                      className="cursor-pointer w-full h-full object-cover rounded-full"
                    />
                  </label>
                  <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                </div>
                <p className="text-sm text-zinc-400">프로필 이미지를 변경해주세요</p>
              </div>
            </div>

            {/* 닉네임 입력 */}
            <div className="mt-7 p-4">
              <BoxInput
                label="닉네임"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className={'py-4'}
              />
            </div>
          </div>

          {/* 저장 버튼 */}
          <FooterButton onClick={handleSaveChanges} disabled={!isValid}>
            저장하기
          </FooterButton>
        </>
      )}
    </div>
  );
};

export default UpdateUser;
