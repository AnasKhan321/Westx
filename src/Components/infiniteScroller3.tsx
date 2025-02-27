import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { Suspense, useEffect, useRef } from "react";
import { Tweet } from "../utils/type";
import SmallLoader from "../ReusableComponents/SmallLoader";
import { BiRepost } from "react-icons/bi";
import TweetSkeleton, { TwitterSkeletonComponent } from "../ReusableComponents/TweetSkeleton";

const TwetCARD = React.lazy(() => import("../ReusableComponents/TweetCard"));
interface TweetResponse {
  success: boolean;
  data: Tweet[];
  hasMore: boolean; // API must return this
}

const fetchTweets = async ({ pageParam = 1 }) => {
  const { data } = await axios.get<TweetResponse>(
    `${import.meta.env.VITE_PUBLIC_AI_URL}/api/tweet/latesttweets/${pageParam}`
  );

  return {
    data: data.data,
    nextCursor: data.hasMore ? pageParam + 1 : undefined, // ✅ Only increment if hasMore is true
  };
};

function Tweets() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["tweets"],
    queryFn: fetchTweets,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 1,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Ref to track the intersection observer
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!bottomRef.current || !hasNextPage) return;
  
    const observer = new IntersectionObserver(
      (entries) => {
        console.log("Observed:", entries[0].isIntersecting);  // 🔍 Debug log
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          console.log("Fetching next page...");  // ✅ Should log when fetching
          fetchNextPage();
        }
      },
      { rootMargin: "200px", threshold: 0.5 } // 👈 Trigger earlier
    );
  
    const currentRef = bottomRef.current;
    observer.observe(currentRef);
  
    return () => {
      observer.unobserve(currentRef);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === "error")
    return (
      <>
        <div className="mt-16"></div>
        <p>Error: {error.message}</p>
      </>
    );
  if (status == "pending") return <div className="mt-8">
<TweetSkeleton/>

  </div>  

  return (
    <>
      <div className=" mt-8 md:mt-8"></div>

      {data?.pages?.map((group, i) => (
      <React.Fragment key={i}> 

       
        {group?.data?.map((tweet) => (
          <Suspense
            key={tweet.id}  // ✅ Key should be on Suspense, not inside it
            fallback={
              <div className="text-white p-4 md:w-[96%] w-full mx-auto">
                
                <TwitterSkeletonComponent/>
              </div>
            }
          >
            {tweet.tweettype === "REPOST" ? (
              <>
                <div className="flex items-center pl-8 py-2 space-x-2 text-gray-500 font-bold">
                  <BiRepost className="text-xl" />
                  <span className="text-xs">{tweet.user.name} reposted</span>
                </div>
                <TwetCARD tweet={tweet.originalTweet as Tweet} isBookmark={false} />
              </>
            ) : (
              <TwetCARD tweet={tweet} isBookmark={false} />
            )}
          </Suspense>
        ))}
      </React.Fragment>
    ))}


      {/* Invisible div to track scrolling and auto-load new data */}
      <div ref={bottomRef} className="h-5" />

      {isFetchingNextPage && (
        <div className="flex justify-center w-full  ">
          <SmallLoader />
        </div>
      )}
    </>
  );
}

export default Tweets;
