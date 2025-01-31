import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { getUserFollower } from "../utils/apicalls"
import Loader from "../ReusableComponents/Loader"
import ReuseableTitle from "../ReusableComponents/ReuseableTitle"
import UserCard from "../ReusableComponents/UserCard"
import { User } from "firebase/auth"


const Follower = () => {
    
    const {username} = useParams()

    const {data , isLoading , isError}  = useQuery({queryKey : [`USER:FOLLOWERS:${username}`]  , 
        queryFn: ()=> getUserFollower(username as string)
     })
  return (
    <div>
          <ReuseableTitle title={`Follower`}/>
          <div className="mt-16"></div>
      {isLoading && <Loader/> }

    {data?.data && <div> 

        {data.data.map((user)=>{
            return(
                <UserCard user={user.follower}/>
            )
        })}
    </div> }
    



      
    </div>
  )
}

export default Follower
