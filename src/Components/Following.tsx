import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { getUserFollowing } from "../utils/apicalls"
import Loader from "../ReusableComponents/Loader"
import UserCard from "../ReusableComponents/UserCard"
import ReuseableTitle from "../ReusableComponents/ReuseableTitle"


const Following = () => {

    const {username} = useParams()


    
    const {data , isLoading }  = useQuery({queryKey : [`USER:FOLLOWING:${username}`]  , 
        queryFn: ()=> getUserFollowing(username as string),
        staleTime: Infinity, 
        refetchOnMount: false, 
        refetchOnWindowFocus: false, 
     })


    
  return (
    <div>
        <ReuseableTitle title={`Following`}/>
        <div className="mt-16"></div>
     {isLoading && <Loader/> }
     {   <div> 

        {data?.data.length == 0 && <> 
            
            <div className="text-center font-bold mt-10 text-xl "> He Does not Have Any Following </div>
        </>}

        {data?.data.map((data)=>{
            return(
                <UserCard user={data.following}/>

            )
        })}

     </div> }
    </div>
  )
}

export default Following
