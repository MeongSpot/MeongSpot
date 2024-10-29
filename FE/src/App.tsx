import { Outlet, useLocation } from 'react-router-dom';
import Nav from '@/components/Layout/Nav';

<<<<<<< HEAD
const App = () => (
  <div className="flex flex-col items-center justify-center">
    <div className="min-w-96 max-w-xl w-full pb-14">
      <Outlet />
    </div>
    <Nav />
  </div>
);
=======
const App = () => {
  const location = useLocation();
  const hideNav = ['/login', '/signup'].includes(location.pathname);
>>>>>>> 97447510faa63c9b18cd04abc3d7634d02a7cd30

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