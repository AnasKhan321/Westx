import {
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoPersonOutline, IoPersonSharp } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { useAuth } from "../Context/AuthContext";
import { PiUsersThree, PiUsersThreeFill } from "react-icons/pi";
import { PiShoppingCartFill   , PiShoppingCartLight } from "react-icons/pi";
const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  return (
    <div className="h-screen w-64 bg-black text-white flex flex-col items-center  px-4 py-6 space-y-6 ">
      {/* Profile Section */}
      <div className="flex items-center space-x-3">
        <img
          src="https://codewithbat.s3.ap-south-1.amazonaws.com/logo-round.png" // Replace with the profile image path
          alt="Profile Logo"
          className="w-20 h-20 rounded-full"
        />
      </div>

      <div className="flex justify-end w-full  ">
        <nav className="space-y-8   ">
          <Link
            to="/"
            className="flex items-center space-x-3   transition-all hover:text-territary"
          >
            {location.pathname == "/" ? (
              <AiFillHome size={24} />
            ) : (
              <AiOutlineHome size={24} />
            )}

            <span className="font-medium text-xl font-roboto">Home</span>
          </Link>

          <Link
            to="/bookmark"
            className="flex items-center space-x-3  transition-all hover:text-territary"
          >
            {location.pathname == "/bookmark" ? (
              <FaBookmark size={22} />
            ) : (
              <FaRegBookmark size={22} />
            )}

            <span className="font-medium text-xl  font-roboto ">Bookmarks</span>
          </Link>


          <Link
            to="/personas"
            className="flex items-center space-x-3  transition-all hover:text-territary"
          >
            {location.pathname == "/personas" ? (
              <PiUsersThreeFill size={23} />
            ) : (
              <PiUsersThree size={23} />
            )}
            <span className="font-medium text-xl  font-roboto">Personas</span>
          </Link>

          <Link
            to="/profile"
            className="flex items-center space-x-3  transition-all hover:text-territary"
          >
            {location.pathname == "/profile" ? (
              <IoPersonSharp size={23} />
            ) : (
              <IoPersonOutline size={23} />
            )}
            <span className="font-medium text-xl font-roboto">Profile</span>
          </Link>

   
        </nav>

        {user?.username && (
       
          <Link to={`/profile`} className="mt-auto flex items-end space-x-3 absolute bottom-5  ">
            <img
              src={user?.photoURL as string} // Replace with the user profile image path
              alt="User Profile"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{user?.name} </p>
              <p className="text-gray-400 text-sm">{user?.username}</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
