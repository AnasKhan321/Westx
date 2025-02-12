import { useQuery } from "@tanstack/react-query"
import { getUserLikes } from "../utils/apicalls"
import Loader from "./Loader"
import TweetDetailTweet from "./TweetCard3"



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
      {isLoading && <Loader/>}
      {isError && <div className="text-center mt-5 font-bold"> Something Went Wrong !  </div> }

      {data?.success && <div> 
        {data.data.length == 0  && <div className="text-center font-bold p-4 text-xl "> He doesn't Have any Liked Post !  </div>}

            {data.data.map((item)=> {
                return(
                    <TweetDetailTweet tweet={item.tweet}/>
                )
            })}
        </div>}
    </div>
  )
}

export default UserLikes
