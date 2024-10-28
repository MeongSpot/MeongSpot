import { Outlet } from 'react-router-dom';
import Nav from '@/components/Layout/Nav';

const App = () => (
  <div className="mobile-container">
    <div className="mobile-content">
      <Outlet />
    </div>
    <Nav />
  </div>
);

export default App;
