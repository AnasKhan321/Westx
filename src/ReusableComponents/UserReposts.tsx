import { useQuery } from "@tanstack/react-query"
import { getUserReposts } from "../utils/apicalls"
import TweetDetailTweet from "./TweetCard3"
import { Tweet } from "../utils/type"
import TweetSkeleton from "./TweetSkeleton"




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
      {isLoading && 
          <TweetSkeleton/>
    }

      {isError && <p className="font-bold text-center mt-5">Internal Server Error Try Again</p> }
      
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
