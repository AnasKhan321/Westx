import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { Suspense, useEffect, useRef } from 'react'
import { Tweet } from '../utils/type'
import SmallLoader from '../ReusableComponents/SmallLoader'
import Loader from '../ReusableComponents/Loader'
import { useAuth } from '../Context/AuthContext'
import { BiRepost } from 'react-icons/bi'


const TwetCARD =  React.lazy(() => import("../ReusableComponents/TweetCard"));
interface TweetResponse {
  success: boolean
  data: Tweet[]
  hasMore: boolean // API must return this
}

const fetchTweets = async ({ pageParam = 1   , userid}  : {pageParam : number , userid : string | undefined}) => {
  const { data } = await axios.get<TweetResponse>(
    `${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/followingtweet/${userid}/${pageParam}`
  )

  return {
    data: data.data,
    nextCursor: data.data.length > 0 ? pageParam + 1 : undefined, // Stop pagination when no more data
  }
}

function FollowingTweets() {
  const {user}  =useAuth() 
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [`following:tweets:${user?.id}`], // Include userid in the query key to refetch when it changes
    queryFn: ({ pageParam }) => fetchTweets({ pageParam, userid: user?.id }), // Pass pageParam and userid properly
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 1,
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
  if(status == 'pending')  return <Loader/> 



  return (
    <>


      <div className="mt-16"></div>

      {data?.pages?.length === 0 || data?.pages?.every(page => page.data.length === 0) ? (
      <p className="text-center text-gray-200 my-4 font-bold text-xl  ">No tweets to show.</p>
    ) : (
      data?.pages?.map((group, i) => (
        <React.Fragment key={i}>
          {group.data.map((tweet) => (
          <Suspense
          key={tweet.id}  // ✅ Key should be on Suspense, not inside it
          fallback={
            <div className="text-center my-4">
              <SmallLoader />
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

export default FollowingTweets
