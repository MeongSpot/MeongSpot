import { NavLink, useLocation } from 'react-router-dom';
import { FaMap, FaComments, FaUsers, FaUser } from 'react-icons/fa';

function Nav() {
  const location = useLocation();
  const isRootActive = location.pathname === '/';

  return (
    <nav className="fixed bottom-0 min-w-96 max-w-xl w-full flex bg-white shadow-[0_-2px_4px_rgba(0,0,0,0.1)] text-[#9B9B9B] z-10">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex-1 flex flex-col items-center justify-center py-3 hover:text-light-orange ${
            isActive || isRootActive ? 'text-light-orange' : 'text-[#9B9B9B]'
          }`
        }
        end // end prop 추가하여 정확한 경로 매칭
      >
        <FaMap className="text-xl mb-1" />
        <p className="text-xs">지도</p>
      </NavLink>
      <NavLink
        to="myMeetUpRoom"
        className={({ isActive }) =>
          `flex-1 flex flex-col items-center justify-center py-2 hover:text-light-orange ${
            isActive ? 'text-light-orange' : 'text-[#9B9B9B]'
          }`
        }
      >
        <FaUsers className="text-xl mb-1" />
        <p className="text-xs">모임</p>
      </NavLink>
      <NavLink
        to="chat"
        className={({ isActive }) =>
          `flex-1 flex flex-col items-center justify-center py-2 hover:text-light-orange ${
            isActive ? 'text-light-orange' : 'text-[#9B9B9B]'
          }`
        }
      >
        <FaComments className="text-xl mb-1" />
        <p className="text-xs">채팅</p>
      </NavLink>
      <NavLink
        to="myPage"
        className={({ isActive }) =>
          `flex-1 flex flex-col items-center justify-center py-2 hover:text-light-orange ${
            isActive ? 'text-light-orange' : 'text-[#9B9B9B]'
          }`
        }
      >
        <FaUser className="text-xl mb-1" />
        <p className="text-xs">마이페이지</p>
      </NavLink>
    </nav>
  );
}

export default Nav;
