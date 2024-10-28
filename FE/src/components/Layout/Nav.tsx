import { Link } from 'react-router-dom';
import { FaMap, FaComments, FaUsers, FaUser } from 'react-icons/fa';

function Nav() {
    return (
        <nav className="fixed bottom-0 min-w-96 max-w-xl w-full flex justify-around py-4 items-center bg-slate-50 rounded-t-xl shadow text-gray-400 z-10">
            <Link to="kakaoMap" className="hover:text-custom-orange">
                <FaMap />
            </Link>
            <Link to="group" className="hover:text-custom-orange">
                <FaUsers /> 
            </Link>
            <Link to="chat" className="hover:text-custom-orange">
                <FaComments /> 
            </Link>
            <Link to="myPage" className="hover:text-custom-orange">
                <FaUser />
            </Link>
        </nav>
    );
}

export default Nav;