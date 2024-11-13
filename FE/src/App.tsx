import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import Nav from '@/components/Layout/Nav';

const App = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { spotId } = useParams<{ spotId: string }>();
  const [showNav, setShowNav] = useState(true);
  const createRoomPattern = /^\/allmeetuproom\/\d+\/create$/; // 정규식 추가
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
    createRoomPattern.test(location.pathname) || // 정규식 체크 추가
    (location.pathname.startsWith('/chat/') && id) ||
    (location.pathname.startsWith('/participatedog/') && id) ||
    (location.pathname.startsWith('/allmeetuproom/') && spotId) ||
    (location.pathname.startsWith('/dog/') && id) ||
    (location.pathname.startsWith('/walkinglog/') && id) ||
    (location.pathname.startsWith('/profile/') && id) ||
    (location.pathname.startsWith('/meetupdoglist/') && id);

  return (
    <div className="mobile-container">
      <div className="mobile-content">
        <Outlet context={{ setShowNav }} />
      </div>
      {showNav && !hideNav && <Nav />}
    </div>
  );
};

export default App;
