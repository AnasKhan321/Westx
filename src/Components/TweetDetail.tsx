import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ReplyBox from "../ReusableComponents/ReusableComponent";
import Loader from "../ReusableComponents/Loader";
import { getTweetDetail } from "../utils/apicalls";

import React, { Suspense } from "react";
import TweetReply from "./ReplyScroller";
import { IoCaretBack } from "react-icons/io5";
import Loader2 from "../ReusableComponents/Loader2";
const TwetCARD = React.lazy(() => import("../ReusableComponents/TweetCard"));
export default function TweetDetail() {
  const { id } = useParams();

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
    <div  className=" min-h-screen max-h-screen  md:max-h-[96vh] md:min-h-[96vh]  border border-white/10  md:my-[2vh]  w-full bg-primaryColor md:bg-secondaryColor overflow-y-scroll rounded-2xl   ">

          <div className="flex absolute p-4 items-center space-x-2  backdrop-blur-xl  w-full  bg-secondaryColor/20  md:w-[50%] rounded-2xl font-bold   "> 
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
              <ReplyBox tweetid={data.data.id} />
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
