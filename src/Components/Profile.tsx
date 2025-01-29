
import { useAuth } from "../Context/AuthContext"
import ReuseableTitle from "../ReusableComponents/ReuseableTitle" ; 

import Profile from "../ReusableComponents/UserDetails";
import { User } from "../utils/type";



const ProfileDetail = () => {

  const {user}  = useAuth()


  




  return (
    <> 
      <ReuseableTitle title="Profile" />
      
      
      <div className="mt-16"> 
        
        
                  <Profile profile={user as User } />
          </div>
    </>

  )
}

export default ProfileDetail