
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { IoPersonOutline, IoPersonSharp } from "react-icons/io5";
import { PiUsersThree, PiUsersThreeFill } from "react-icons/pi";
import { Link, useLocation } from "react-router-dom";
import { IoSearchOutline, IoSearchSharp } from "react-icons/io5";
import { GoHomeFill   , GoHome  } from "react-icons/go";
import { PiUserList  , PiUserListFill  } from "react-icons/pi";
import { HiOutlineCurrencyDollar   , HiCurrencyDollar } from "react-icons/hi";
const HorizontalBar = () => {
  const location = useLocation();

  return (
    <>

      <div className="flex w-[95%] h-full mx-auto justify-between items-center text-white text-lg">
        <div className="w-full rounded-3xl  border border-white bg-secondaryColor py-4 px-4 mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center space-x-3 transition-all hover:text-territary"
          >
            {location.pathname === "/" ? <GoHomeFill size={24} /> : <GoHome size={24} />}
          </Link>



          <Link to={`/search`}>
            {location.pathname === "/search" ? <IoSearchSharp size={23} /> : <IoSearchOutline size={23} />}
          </Link>
          <Link
            to="/personas"
            className="flex items-center space-x-3 transition-all hover:text-territary"
          >
            {location.pathname === "/personas" ? <PiUserListFill size={25} /> : <PiUserList size={25} />}
          </Link>



          <Link
            to="/add-points"
            className="flex items-center space-x-3 transition-all hover:text-territary"
          >
            {location.pathname === "/add-points" ? <HiCurrencyDollar size={29} /> : <HiOutlineCurrencyDollar size={29} />}
          </Link>


          <Link
            to="/my-personas"
            className="flex items-center space-x-3 transition-all hover:text-territary"
          >
            {location.pathname == "/my-personas" ? (
              <PiUsersThreeFill size={24} />
            ) : (
              <PiUsersThree size={24} />
            )}
          </Link>

          <Link
            to="/bookmark"
            className="flex items-center space-x-3 transition-all hover:text-territary"
          >
            {location.pathname === "/bookmark" ? <FaBookmark size={22} /> : <FaRegBookmark size={22} />}
          </Link>






          <Link
            to="/profile"
            className="flex items-center space-x-3 transition-all hover:text-territary"
          >
            {location.pathname === "/profile" ? <IoPersonSharp size={23} /> : <IoPersonOutline size={23} />}
          </Link>
        </div>
      </div>



    </>
  );
};

export default HorizontalBar;
