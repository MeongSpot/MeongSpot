import { Outlet, useLocation } from 'react-router-dom';
import Nav from '@/components/Layout/Nav';

const App = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const hideNav =
    ['/login', '/signup/auth', '/signup/info','/signup/complete'].includes(location.pathname) || (pathSegments[1] === 'chat' && pathSegments.length === 4);

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
