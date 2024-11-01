import { NavLink, useLocation } from 'react-router-dom';
import { FaMap, FaComments, FaUsers, FaUser } from 'react-icons/fa';

function Nav() {
  const location = useLocation();
  // 지도 관련 경로들을 모두 체크
  const isMapActive = ['/', '/meeting', '/walking'].includes(location.pathname);

  return (
    <nav className="fixed bottom-0 min-w-96 max-w-xl w-full flex bg-white shadow-[0_-2px_4px_rgba(0,0,0,0.1)] text-[#9B9B9B] z-10">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex-1 flex flex-col items-center justify-center py-3 hover:text-light-orange ${
            isActive || isMapActive ? 'text-light-orange' : 'text-[#9B9B9B]'
          }`
        }
      >
        <FaMap className="text-xl mb-1" />
        <p className="text-xs">지도</p>
      </NavLink>
      {/* 나머지 NavLink들은 그대로 유지 */}
      <NavLink
        to="mymeetuproom"
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
        to="mypage"
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
