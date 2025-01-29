import { FaBookmark, FaHome, FaUser, FaUsers } from "react-icons/fa"
import { Link } from "react-router-dom"

const HorizontalBar = () => {
  return (
    <div className='flex w-[90%]  h-full  mx-auto  justify-between items-center text-white text-lg py-4   '>

            <div className="hover:text-territary" > <Link  to={`/`}>   <FaHome  className="text-xl" /></Link>  </div>
            <div className="hover:text-territary" ><Link  to={`/bookmark`}>   <FaBookmark  className="text-xl" /></Link> </div>
            <div className="hover:text-territary" ><Link  to={`/profile`}>   <FaUser  className="text-xl" /></Link> </div>
            <div className="hover:text-territary" ><Link  to={`/personas`}>   <FaUsers  className="text-xl" /></Link>  </div>
      



    </div>
  )
}

export default HorizontalBar