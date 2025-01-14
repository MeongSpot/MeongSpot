import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import Nav from '@/components/Layout/Nav';

const App = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { spotId } = useParams<{ spotId: string }>();
  const { roomId } = useParams<{ roomId: string }>();
  const [showNav, setShowNav] = useState(true);
  const [isWalking, setIsWalking] = useState(false); // 산책 상태 추가

  const createRoomPattern = /^\/allmeetuproom\/\d+\/create$/;
  const hideNav =
    [
      '/login',
      '/signup/auth',
      '/signup/info',
      '/signup/complete',
      '/mypage/update',
      '/settings',
      '/notification',
      '/registerdog',
      '/selectbreed',
      '/friendslist',
      '/dog',
      '/walkinglog',
      '/searchuser',
    ].includes(location.pathname) ||
    createRoomPattern.test(location.pathname) ||
    (location.pathname.startsWith('/chat/') && id) ||
    (location.pathname.startsWith('/participatedog/') && roomId) ||
    (location.pathname.startsWith('/allmeetuproom/') && spotId) ||
    (location.pathname.startsWith('/dog/') && id) ||
    (location.pathname.startsWith('/walkinglog/') && id) ||
    (location.pathname.startsWith('/profile/') && id) ||
    (location.pathname.startsWith('/meetupdoglist/') && id);

  return (
    <div className="mobile-container bg-white">
      <div className="mobile-content">
        <Outlet context={{ setShowNav, setIsWalking }} />
      </div>
      {showNav && !hideNav && !isWalking && <Nav />}
    </div>
  );
};

export default App;
