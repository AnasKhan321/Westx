import { AiFillHome, AiOutlineHome } from "react-icons/ai"
import { FaBookmark, FaRegBookmark } from "react-icons/fa"
import { IoPersonOutline, IoPersonSharp } from "react-icons/io5"
import { PiUsersThree, PiUsersThreeFill } from "react-icons/pi"
import { Link, useLocation } from "react-router-dom"

const HorizontalBar = () => {
  const location = useLocation();
  return (
    <div className='flex w-[90%]  h-full  mx-auto  justify-between items-center text-white text-lg py-4   '>

 
          <Link
            to="/"
            className="flex items-center space-x-3   transition-all hover:text-territary"
          >
            {location.pathname == "/" ? (
              <AiFillHome size={24} />
            ) : (
              <AiOutlineHome size={24} />
            )}

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
          </Link>

   
    




    </div>
  )
}

export default HorizontalBar