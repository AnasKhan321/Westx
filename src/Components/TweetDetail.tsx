import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ReplyBox from "../ReusableComponents/ReusableComponent";
import Loader from "../ReusableComponents/Loader";
import { getTweetDetail } from "../utils/apicalls";

import React, { Suspense } from "react";
import TweetReply from "./ReplyScroller";
import { IoCaretBack } from "react-icons/io5";
import Loader2 from "../ReusableComponents/Loader2";
import SEO from "../ReusableComponents/SEO";
import { useAuth } from "../Context/AuthContext";
const TwetCARD = React.lazy(() => import("../ReusableComponents/TweetCard"));
export default function TweetDetail() {
  const { id } = useParams();
  const {isAuthenticated} = useAuth()

  const { isLoading, data, isError } = useQuery({
    queryKey: ["tweet", id],
    queryFn: () => getTweetDetail(id as string),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const navigate = useNavigate();
  const handleClick = ()=>{
          navigate(-1);
  }


  return (
    <div  className=" min-h-screen max-h-screen  md:max-h-[98vh] md:min-h-[98vh]  border border-white/10  md:mt-[2vh]  w-full bg-primaryColor md:bg-secondaryColor overflow-y-scroll rounded-l-2xl   ">
        <SEO title={ `Tweet - ${id}`} description={`Tweet page for ${id}`} />
          <div className="flex absolute p-4 items-center space-x-2  backdrop-blur-xl  w-full  bg-newcolor border-2 border-[#13181b] xl:w-[50%] rounded-l-2xl font-bold   "> 
            <IoCaretBack className="text-xl cursor-pointer" onClick={handleClick}/> 
            <span>Tweet</span>
           </div>

      {isLoading && <Loader2  fullScreen={true}/> }
      {isError && <div>Error...</div>}
      {data?.success && (
        <div>
          <div className="mt-16">
            <Suspense fallback={<Loader />}>
              <TwetCARD tweet={data.data} isBookmark={false} />
            </Suspense>

            <div className="w-full">
              {isAuthenticated  && 
                <ReplyBox tweetid={data.data.id} />}
          
            </div>
            <TweetReply tweetid={id as string}/> 

          </div>
        </div>
      )}

      {data?.success == false && (
        <div>
          <div className="mt-16"> </div> 
          <div className="text-center font-bold text-xl mt-5  "> Tweet Not found ! </div> 
        </div>
      )}
    </div>
  );
}
