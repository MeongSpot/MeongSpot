import { Outlet, useLocation } from 'react-router-dom';
import Nav from '@/components/Layout/Nav';

const App = () => {
  const location = useLocation();
  const hideNav = ['/login', '/signup'].includes(location.pathname);

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