import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ReplyBox from "../ReusableComponents/ReusableComponent";

import ReuseableTitle from "../ReusableComponents/ReuseableTitle";
import Loader from "../ReusableComponents/Loader";
import { getReplies, getTweetDetail } from "../utils/apicalls";

import SmallLoader from "../ReusableComponents/SmallLoader";
import React, { Suspense } from "react";

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


  const { isLoading: replyloading, data: replydata } = useQuery({
    queryKey: [`Tweet:Reply:${id}`],
    queryFn: () => getReplies(id as string),
  });

  return (
    <div>
      <ReuseableTitle title="Tweet" />
      {isLoading && <Loader />}
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

            {replyloading && (
              <div className="flex text-center items-center justify-center">
                <SmallLoader />
              </div>
            )}

            {replydata?.data.map((reply, index) => (
              <div key={index} className="border-b-2 border-borderColor">
                <Suspense fallback={<Loader />}>
                  <TwetCARD tweet={reply} isBookmark={false} />
                </Suspense>
              </div>
            ))}
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
