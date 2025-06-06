import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { Suspense, useEffect, useRef } from 'react'
import { useAuth } from '../Context/AuthContext'

import { FaUserFriends, FaCompass } from 'react-icons/fa'
import TweetSkeleton, { TwitterSkeletonComponent } from '../ReusableComponents/TweetSkeleton'
import Loader2 from '../ReusableComponents/Loader2'
import { SupabaseTweet } from '../ReusableComponents/SupabaseTweet'
import { useNavigate } from 'react-router-dom'


const TwetCARD = React.lazy(() => import("../ReusableComponents/SupabaseTweet"));
interface TweetResponse {
  success: boolean
  data: SupabaseTweet[]
  hasMore: boolean // API must return this
}

const fetchTweets = async ({ pageParam = 1, userid }: { pageParam: number, userid: string | undefined }) => {
  const { data } = await axios.get<TweetResponse>(
    `${import.meta.env.VITE_PUBLIC_AI_URL}/api/supabase/followingtweet/${userid}/${pageParam}`
  )
  console.log(data)
  return {
    data: data.data,
    nextCursor: data.data.length > 0 ? pageParam + 1 : undefined, // Stop pagination when no more data
  }
}

function FollowingTweets() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [`following:tweets:${user?.id}`],
    queryFn: ({ pageParam }) => fetchTweets({ pageParam, userid: user?.id }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined, // Ensure no extra fetch
    initialPageParam: 1,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });


  // Ref to track the intersection observer
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


  if (status === 'error') return <p>Error: {error.message}</p>
  if (status == 'pending') return <div className="mt-8">
    <TweetSkeleton />

  </div>




  return (
    <>


      <div className=" mt-16 md:mt-16"></div>

      {data?.pages?.length === 0 || data?.pages?.every(page => page?.data?.length === 0) ? (
        <div className="text-center text-gray-200 mt-12 h-[50vh] flex flex-col justify-center items-center space-y-6">
          <div className="w-12 h-12 lg:w-20 lg:h-20 bg-purple-600/20 rounded-full flex items-center justify-center">
            <FaUserFriends className="text-2xl lg:text-4xl text-purple-500" />
          </div>
          <div className="space-y-3">
            <div className=" text-xl lg:text-3xl font-bold  bg-clip-text text-white ">
              Your Following Feed is Empty
            </div>
            <div className="text-gray-400 max-w-sm lg:max-w-md text-center leading-relaxed">
              Connect with others to see their tweets here. Follow people who share your interests and start engaging with their content!
            </div>
          </div>
          <button 
            onClick={() => navigate('/personas')}
            className="mt-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white rounded-full transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl "
          >
            <FaCompass className="text-base lg:text-lg" />
            <span>Discover People to Follow</span>
          </button>
        </div>
      ) : (
        data?.pages?.map((group, i) => (
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
                
                 
                  <TwetCARD tweet={tweet} isBookmark={false} />
               
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
  )
}

export default FollowingTweets
