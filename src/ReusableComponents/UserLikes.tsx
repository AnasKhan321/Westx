import { useQuery } from "@tanstack/react-query"
import { getUserLikes } from "../utils/apicalls"
import TweetDetailTweet from "./TweetCard3"
import TweetSkeleton from "./TweetSkeleton"



const UserLikes = ({id}  : {id : string}) => {

    const {isLoading , isError , data }  = useQuery({
        queryKey : [`user:likes:${id}`] , 
        queryFn : ()=> getUserLikes(id),
        staleTime: Infinity, 
        refetchOnMount: false, 
        refetchOnWindowFocus: false, 
    })
  return (
    <div>
      {isLoading && 
       <TweetSkeleton/>
    }
      {isError &&  <p className="font-bold text-center mt-5">Internal Server Error Try Again</p>}

      {data?.success && <div> 
        {data.data.length == 0  && <div className="text-center font-bold p-4 text-xl py-12 "> He doesn't Have any Liked Post !  </div>}

            {data.data.map((item , index)=> {
                return(
                    <TweetDetailTweet key={index} tweet={item.tweet}/>
                )
            })}
        </div>}
    </div>
  )
}

export default UserLikes
