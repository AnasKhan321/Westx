import { useInfiniteQuery } from "@tanstack/react-query"
import TweetSkeleton, { TwitterSkeletonComponent } from "./TweetSkeleton"
import React, { Suspense, useEffect, useRef } from "react"
import { Like } from "../utils/type"
import Loader2 from "./Loader2"

const getUserLikes = async ({ userid, page }: { userid: string, page: number }) => {
  const res = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/alllikes/${userid}/${page}`)
  const data = await res.json();
  return {
    data: data.data,
    nextCursor: data.data.length > 0 ? page + 1 : undefined, // Stop pagination when no more data
  }
}


const TweetCardBookmark = React.lazy(
  () => import("../ReusableComponents/TweetCardBookmark")
);

const UserLikes = ({ id }: { id: string }) => {

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [`user:likes:${id}`],
    queryFn: ({ pageParam }) => getUserLikes({ page: pageParam, userid: id }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined, // Ensure no extra fetch
    initialPageParam: 1,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!bottomRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {

        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {

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


  const getUniqueTweets = (pages: any[]) => {
    const seenTweets = new Set();
    const uniqueTweets = pages.flatMap(group => 
      group.data.filter((tweet: Like) => {
        const isDuplicate = seenTweets.has(tweet.id);
        seenTweets.add(tweet.id);
        return !isDuplicate;
      })
    );
    return uniqueTweets;
  };


  if (status === 'error') return <p className="text-center text-gray-200 my-4 font-bold text-xl  ">Internal Server Error</p>
  if (status == 'pending') return <div className="mt-4">
    <TweetSkeleton />
  </div>

  return (
    <div>
      <>
        {data?.pages?.length === 0 || data?.pages?.every(page => page?.data?.length === 0) ? (
          <p className="text-center text-gray-200 my-4 font-bold text-xl  ">No tweets to show.</p>
        ) : (
          data?.pages?.map((group, i) => (
            <React.Fragment key={i}>
              {group.data.length == 0 && <> <div className='py-8 text-center font-bold text-xl'> No more Tweets  </div>  </>}
             { getUniqueTweets(data?.pages || []).map((tweet : Like) => (
                <Suspense
                  key={tweet.id}  // ✅ Key should be on Suspense, not inside it
                  fallback={

                    <div className="text-white p-4 md:w-[96%] w-full mx-auto">

                      <TwitterSkeletonComponent />
                    </div>

                  }
                >
                  <TweetCardBookmark tweet={tweet.tweet} />
                </Suspense>
              ))}
            </React.Fragment>
          ))
        )}

        {/* Invisible div to track scrolling and auto-load new data */}
        <div ref={bottomRef} className="h-10" />

        {isFetchingNextPage && (

          <div className=" flex justify-center items-start h-[14vh] ">
            <Loader2 />
          </div>


        )}
      </>

    </div>
  )
}

export default UserLikes
