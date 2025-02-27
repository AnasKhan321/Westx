import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { Suspense, useEffect, useRef } from 'react'
import { Tweet } from '../utils/type'
import SmallLoader from '../ReusableComponents/SmallLoader'
import { useAuth } from '../Context/AuthContext'
import { BiRepost } from 'react-icons/bi'
import TweetSkeleton, { TwitterSkeletonComponent } from '../ReusableComponents/TweetSkeleton'


const TwetCARD =  React.lazy(() => import("../ReusableComponents/TweetCard"));
interface TweetResponse {
  success: boolean
  data: Tweet[]
  hasMore: boolean // API must return this
}

const fetchTweets = async ({ pageParam = 1   , userid}  : {pageParam : number , userid : string | undefined}) => {
  const { data } = await axios.get<TweetResponse>(
    `${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/foryou/${userid}/${pageParam}`
  )

  return {
    data: data.data,
    nextCursor: data.hasMore ? pageParam + 1 : null, // Ensure null instead of undefined if no more pages
  };
}

function ForYouTweets() {
  const {user}  =useAuth() 
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [`foryou:tweets:${user?.username}`], 
    queryFn: ({ pageParam }) => fetchTweets({ pageParam, userid: user?.username }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined, // Ensures undefined if no more pages
    initialPageParam: 1,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Ref to track the intersection observer
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!bottomRef.current || !hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage() // Automatically load more
        }
      },
      { threshold: 1.0 } // Trigger when 100% visible
    )

    observer.observe(bottomRef.current)

    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  if (status === 'error') return <p>Error: {error.message}</p>
  if(status == 'pending')  return<div className="mt-8">
  <TweetSkeleton/>
  
    </div>  
  




  return (
    <>


      <div className=" mt-16 md:mt-16"></div>

      {data?.pages?.length === 0 || data?.pages?.every(page => page?.data?.length === 0) ? (
      <p className="text-center text-gray-200 my-4 font-bold text-xl  ">No tweets to show.</p>
    ) : (
      data?.pages?.map((group, i) => (
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
      ))
    )}

      {/* Invisible div to track scrolling and auto-load new data */}
      <div ref={bottomRef} className="h-10" />
      
      {isFetchingNextPage && (
        <div className="flex justify-center w-full">
          <SmallLoader />
        </div>
      )}
    </>
  )
}

export default ForYouTweets
