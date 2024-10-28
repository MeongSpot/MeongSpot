import { Outlet } from 'react-router-dom';
// import Nav from '@/components/Layout/Nav';
const App = () => (
  <div className="flex justify-center">
    <div className="min-w-96 max-w-xl w-full pb-14">
      <Outlet />
    </div>
    {/* <Nav /> */}
  </div>
);
export default App;
