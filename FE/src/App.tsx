import { Outlet, useLocation, useParams } from 'react-router-dom';
import Nav from '@/components/Layout/Nav';

const App = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
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
    ].includes(location.pathname) ||
    (location.pathname.startsWith('/chat/') && id) ||
    (location.pathname.startsWith('/participateDog/') && id);

  return (
    <div className="mobile-container">
      <div className="mobile-content">
        <Outlet />
      </div>
      {!hideNav && <Nav />}
    </div>
  );
};

export default App;
