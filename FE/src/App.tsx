import { Outlet } from 'react-router-dom';
import Nav from '@/components/Layout/Nav';

const App = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <div className="min-w-96 max-w-xl w-full flex-grow flex items-center justify-center pb-14">
      <Outlet />
    </div>
    <Nav />
  </div>
);

export default App;
