import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { getUserFollower } from "../utils/apicalls"
import Loader from "../ReusableComponents/Loader"
import ReuseableTitle from "../ReusableComponents/ReuseableTitle"
import UserCard from "../ReusableComponents/UserCard"



const Follower = () => {
    
    const {username} = useParams()

    const {data , isLoading }  = useQuery({queryKey : [`USER:FOLLOWERS:${username}`]  , 
        queryFn: ()=> getUserFollower(username as string),
        staleTime: Infinity, 
        refetchOnMount: false, 
        refetchOnWindowFocus: false, 
     })
  return (
    <div>
          <ReuseableTitle title={`Follower`}/>
          <div className="mt-16"></div>
      {isLoading && <Loader/> }

    {data?.data && <div> 

        {data.data.length ==  0 && <> 
            <div className="text-center font-bold mt-10 text-xl "> He Does not Have Any Follower </div>
        </> }
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
