import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";
import ReplyBox from "../ReusableComponents/ReusableComponent";
import TweetDetailTweet from "../ReusableComponents/TweetCard3";
import { BiHeart, BiMessageRounded, BiRepost } from "react-icons/bi";
import { FaRegBookmark } from "react-icons/fa";
import { MdOutlineIosShare } from "react-icons/md";
import ReuseableTitle from "../ReusableComponents/ReuseableTitle";
import Loader from "../ReusableComponents/Loader";
import { getReplies, getTweetByIdv2 } from "../utils/apicalls";
import ReplyCard from "../ReusableComponents/ReplyCard";
import { useAuth } from "../Context/AuthContext";
import SmallLoader from "../ReusableComponents/SmallLoader";


export default function TweetDetail(){

    const {id} = useParams();
    const {user}  = useAuth() ;
    const {isLoading , data , isError}  = useQuery({queryKey : ['tweet', id], queryFn : ()=>getTweetByIdv2(id as string)});

    const {isLoading:replyloading  , data : replydata  }  = useQuery({queryKey : [`Tweet:Reply:${id}`]   , queryFn : ()=> getReplies(id  as string)})

    return(
        <div>

            {isLoading && <Loader/>}
            {isError && <div>Error...</div>}
            {data && <div>
               <ReuseableTitle title="Tweet" />
                <div className="mt-16">
                <TweetDetailTweet tweet={data.tweet}/>

                {user?.id === data.tweet.user.id ? (<div> </div>)  : (                          <div className="border-b pb-3  border-borderColor ">
                          <div className="flex w-[80%]  items-center justify-between   border-borderColor   mx-auto  mt-5 text-xl text-gray-500">
              <div className="flex gap-x-1 group hover:text-blue-500  transition-all items-center ">
                <BiMessageRounded className=" cursor-pointer  rounded-full p-2 group-hover:bg-blue-500/10   text-4xl " />
                {/* <span className="text-sm">27</span> */}
              </div>
              <BiRepost className="hover:text-green-500 transition-all cursor-pointer   hover:bg-green-500/10 p-2 rounded-full text-4xl   " />
              <div className="flex gap-x-1 group hover:text-red-500  transition-all  group items-center">
                <BiHeart className="group-hover:bg-red-500/10  cursor-pointer text-4xl p-2 rounded-full " />
                {/* <span className="text-sm">27</span> */}
              </div>
    
    
              <div className="flex items-center gap-x-1  text-gray-500">
                <FaRegBookmark  className="hover:text-blue-500    cursor-pointer  hover:bg-blue-500/10 text-4xl p-2 " />
                <MdOutlineIosShare  className="hover:text-blue-500 font-bold  cursor-pointer    hover:bg-blue-500/10 text-4xl p-2 rounded-full" />
              </div>
        </div>
                          </div>)}




                <div className="w-full">
                <ReplyBox   tweetid={data.tweet.id } />

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