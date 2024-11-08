import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import Nav from '@/components/Layout/Nav';

const App = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [showNav, setShowNav] = useState(true);
  const hideNav =
    [
      '/login',
      '/signup/auth',
      '/signup/info',
      '/signup/complete',
      '/allMeetUpRoom/create',
      '/settings',
      '/notification',
      '/registerdog',
      '/selectbreed',
      '/friendslist',
      '/dog',
    ].includes(location.pathname) ||
    (location.pathname.startsWith('/chat/') && id) ||
    (location.pathname.startsWith('/participateDog/') && id) ||
    (location.pathname.startsWith('/dog/') && id);

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
