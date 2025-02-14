import { useQuery } from "@tanstack/react-query"
import { getUserReposts } from "../utils/apicalls"
import Loader from "./Loader"
import TweetDetailTweet from "./TweetCard3"
import { Tweet } from "../utils/type"




const UserReposts = ({id  }  : {id  : string}) => {

      const {isLoading , isError , data }  = useQuery({
          queryKey : [`user:reposts:${id}`] , 
          queryFn : ()=> getUserReposts(id),
          staleTime: Infinity, 
          refetchOnMount: false, 
          refetchOnWindowFocus: false, 
      })

  return (
    <div>
      {isLoading && <Loader/> }

      {isError && <div> Something Went Wrong ! </div> }
      
      {data?.success && <div> 
        {data.data.length == 0  && <div className="text-center font-bold p-4 py-12 text-xl "> He doesn't Have any Reposts !  </div>}

          {data.data.map((item  , index )=>{
            return (
              
              <TweetDetailTweet key={index} tweet={item.originalTweet as Tweet}/>
            )
          })}

      </div> }
      
    </div>
  )
}

export default UserReposts
