import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";
import ReplyBox from "../ReusableComponents/ReusableComponent";

import ReuseableTitle from "../ReusableComponents/ReuseableTitle";
import Loader from "../ReusableComponents/Loader";
import { getReplies, getTweetDetail } from "../utils/apicalls";
import ReplyCard from "../ReusableComponents/ReplyCard";

import SmallLoader from "../ReusableComponents/SmallLoader";
import TweetCard from "../ReusableComponents/TweetCard";


export default function TweetDetail(){

    const {id} = useParams();

    const {isLoading , data , isError}  = useQuery({queryKey : ['tweet', id], queryFn : ()=>getTweetDetail(id as string)  , 

      staleTime: Infinity, 
      refetchOnMount: false, 
      refetchOnWindowFocus: false, 
    });


    const {isLoading:replyloading  , data : replydata  }  = useQuery({queryKey : [`Tweet:Reply:${id}`]   , queryFn : ()=> getReplies(id  as string)})

    return(
        <div>

            {isLoading && <Loader/>}
            {isError && <div>Error...</div>}
            {data && <div>
               <ReuseableTitle title="Tweet" />
                <div className="mt-16">
               <TweetCard tweet={data.data}  isBookmark={false}/>

       




                <div className="w-full">
                <ReplyBox   tweetid={data.data.id } />

                </div>

                {replyloading && <div className="flex text-center items-center justify-center"> 

                    <SmallLoader/>

                </div> }

                {replydata?.data.map((reply  , index)=>(
                 
                  <ReplyCard reply={reply} key={index}/>
                 
                ))}
                </div>
            </div> }
        </div>
    )
}