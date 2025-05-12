import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { PiUsersThree, PiUsersThreeFill } from "react-icons/pi";
import { motion } from 'motion/react';
import { GoHomeFill   , GoHome  } from "react-icons/go";
import { FaRegUser  , FaUser  } from "react-icons/fa6";
import { PiUserList  , PiUserListFill  } from "react-icons/pi";
import { IoStorefrontOutline   , IoStorefront } from "react-icons/io5";
const Sidebar = () => {
  const location = useLocation();
  const { user   , isAuthenticated  , handleTwitterLogin} = useAuth();
  return (
    <div className="h-screen w-44 xl:w-[225px] bg-newcolor text-white flex flex-col items-center  px-4 py-6 space-y-6 font-roboto ">
      {/* Profile Section */}
      <div className="flex items-center space-x-3">
        <img
          src="/logo-round.png" // Replace with the profile image path
          alt="WestX Logo"
          className="w-20 h-20 rounded-full"
        />
      </div>

      <div className="flex justify-end  w-[225px] xl:w-[225px] ">
        <nav className="space-y-4  ">
          <Link
            to="/"
            className= {`flex items-center w-full    space-x-3 pl-2  py-2 ${location.pathname == "/" ? "bg-[#13161b]" : "bg-transparent"}  w-full   transition-all hover:text-territary`}
          >
            {location.pathname == "/" ? (
              <GoHomeFill  size={26} />
            ) : (
              <GoHome  size={26} />
            )}

            <span className="font-medium  text-base  lg:text-xl  font-roboto ">Home</span>
          </Link>
          <Link
            to="/personas"
            className= {`flex items-center space-x-3 pl-2  py-2 ${location.pathname == "/personas" ? "bg-[#13161b]" : "bg-transparent"}  w-full   transition-all hover:text-territary`}
          >
            {location.pathname == "/personas" ? (
              <PiUserListFill size={26} />
            ) : (
              <PiUserList size={26} />
            )}
            <span className="font-medium  text-base  lg:text-xl font-roboto">Personas</span>
          </Link>



          <Link
            to="/my-personas"
            className= {`flex items-center space-x-3 pl-2  py-2  pr-3 ${location.pathname == "/my-personas" ? "bg-[#13161b]" : "bg-transparent"}  w-full   transition-all hover:text-territary`}
          >
            {location.pathname == "/my-personas" ? (
              <PiUsersThreeFill size={26} />
            ) : (
              <PiUsersThree size={26} />
            )}
              <span className="font-medium  text-base  lg:text-xl font-roboto">My Personas</span>
          </Link>


          <Link
            to="/add-points"
            className= {`flex items-center w-full    space-x-3 pl-2  py-2 ${location.pathname == "/add-points" ? "bg-[#13161b]" : "bg-transparent"}  w-full   transition-all hover:text-territary`}
          >
            {location.pathname == "/add-points" ? (
              <IoStorefront  size={26} />
            ) : (
              <IoStorefrontOutline  size={26} />
            )}

            <span className="font-medium  text-base  lg:text-xl  font-roboto ">Add Points</span>
          </Link>

          <Link
            to="/bookmark"
            className= {`flex items-center space-x-3 pl-2  py-2 ${location.pathname == "/bookmark" ? "bg-[#13161b]" : "bg-transparent"}  w-full   transition-all hover:text-territary`}
          >
            {location.pathname == "/bookmark" ? (
              <FaBookmark size={22} />
            ) : (
              <FaRegBookmark size={22} />
            )}

            <span className="font-medium  text-base  lg:text-xl  font-roboto ">Bookmarks</span>
          </Link>





          <Link
            to="/profile"
            className= {`flex items-center space-x-3 pl-2  py-2 ${location.pathname == "/profile" ? "bg-[#13161b]" : "bg-transparent"}  w-full   transition-all hover:text-territary`}
          >
            {location.pathname == "/profile" ? (
              <FaUser  size={23} />
            ) : (
              <FaRegUser size={23} />
            )}
            <span className="font-medium  text-base  lg:text-xl  font-roboto">Profile</span>
          </Link>




          {user?.username && (
          <Link
            to={`/profile`}
            className="mt-auto flex    xl:mx-0 mr-2   space-x-2 absolute bottom-10  "
          >
            <img
              src={user?.photoURL as string} // Replace with the user profile image path
              alt="User Profile"
              className="lg:w-10 lg:h-10 w-8 h-8 rounded-full"
            />
            <div>
              <p className=" lg:text-base text-sm font-semibold">{user?.name} </p>
              <p className="text-gray-400  text-xs  lg:text-sm">{user?.username}</p>
            </div>


            
     
          </Link>
        )}

          {/* <Link
            to="/roastshow"
            className="flex items-center space-x-3  transition-all hover:text-territary"
          >
            {location.pathname == "/roastshow" ? (
              <AiFillFire size={22} />
            ) : (
              <AiOutlineFire size={22} />
            )}

            <span className="fontme dium text-xl  font-roboto ">Roast Show</span>
          </Link> */}
        </nav>
        {!isAuthenticated && (
          <motion.button
            onClick={handleTwitterLogin}
            className="absolute bottom-20  left-3 xl:left-12   group  flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white font-medium overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] hover:scale-[1.02]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated gradient overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "linear"
              }}
            />

            {/* Twitter/X Icon */}
            <motion.svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                repeatDelay: 2
              }}
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </motion.svg>

            <span className="relative z-10">Connect With X</span>

            {/* Animated arrow */}
            <motion.svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ x: [0, 4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 7l5 5m0 0l-5 5m5-5H6" 
              />
            </motion.svg>

            {/* Hover ring effect */}
            <motion.div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(circle at center, rgba(147, 51, 234, 0.3) 0%, transparent 70%)',
              }}
            />
          </motion.button>
        )}
        

          
      </div>
    </div>
  );
};

export default Sidebar;
