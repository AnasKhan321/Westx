import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { Suspense, useEffect, useRef } from "react";
import TweetSkeleton, { TwitterSkeletonComponent } from "../ReusableComponents/TweetSkeleton";
import Loader2 from "../ReusableComponents/Loader2";
import { BiRepost } from "react-icons/bi";
import TweetCard, { SupabaseTweet } from "./SupabaseTweet";


interface SupabaseTweets {
    success: boolean;
    data: SupabaseTweet[];
    hasMore: boolean;
}


const fetchTweets = async ({ pageParam = 1 }) => {
  try {
    const { data } = await axios.get<SupabaseTweets>(
      `https://ai.westx.xyz/api/supabase/tweets/${pageParam}`
    );
    return {
      data: data.data,
      nextCursor: pageParam + 1 ,
    };
  } catch (error) {
    console.error("❌ Error fetching tweets:", error);
    throw error;
  }
};

function Supabasetest() {

  
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
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor;
    },
    initialPageParam: 1,
  });



  // Ref to track the intersection observer
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {

    if (!bottomRef.current || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {


        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        
          fetchNextPage();
        }
      },
      { 
        rootMargin: "200px",  // Changed from 0px to 200px
        threshold: 0.1  // Changed from 0.2 to 0.1 to make it more sensitive
      }
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
    <TweetSkeleton />

  </div>

  return (
    <>
      <div className=" mt-16 md:mt-16"></div>

      {data?.pages?.map((group, i) => (
        <React.Fragment key={i}>


          {group?.data?.map((tweet) => (
            <Suspense
              key={tweet.id}  // ✅ Key should be on Suspense, not inside it
              fallback={
                <div className="text-white p-4 md:w-[96%] w-full mx-auto">

                  <TwitterSkeletonComponent />
                </div>
              }
            >
              {tweet.tweettype === "REPOST" ? (
                <>
                  <div className="flex items-center pl-8 py-2 space-x-2 text-gray-500 font-bold">
                    <BiRepost className="text-xl" />
                    <span className="text-xs">{tweet.User.name} reposted</span>
                  </div>
                  <TweetCard tweet={tweet} isBookmark={false} />
                </>
              ) : (
                <TweetCard tweet={tweet} isBookmark={false} />
              )}
            </Suspense>
          ))}
        </React.Fragment>
      ))}


      {/* Invisible div to track scrolling and auto-load new data */}
      <div ref={bottomRef} className="  h-10" />

      {isFetchingNextPage && (

        <div className=" flex justify-center items-start h-[14vh] ">
            <Loader2 />
        </div>


      )}
    </>
  );
}

export default Supabasetest;

