import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { Suspense, useEffect, useRef } from 'react'
import { Tweet2 } from '../utils/type'
import SmallLoader from '../ReusableComponents/SmallLoader'
import Loader from '../ReusableComponents/Loader'


const TwetCARD =  React.lazy(() => import("../ReusableComponents/TweetCardv2"));
interface TweetResponse {
  success: boolean
  data: Tweet2[]
  hasMore: boolean // API must return this
}

const fetchTweets = async ({ pageParam = 1 }) => {
  const { data } = await axios.get<TweetResponse>(
    `${import.meta.env.VITE_PUBLIC_AI_URL}/api/tweet/latesttweets/v2/${pageParam}`
  )

  return {
    data: data.data,
    nextCursor: data.data.length > 0 ? pageParam + 1 : undefined, // Stop pagination when no more data
  }
}

function TodoList() {

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['tweets'],
    queryFn: fetchTweets,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 1,
  })

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
       <div className=" p-4 bg-black/10 border-b border-white  z-10  flex gap-x-2 top-0 absolute font-bold   backdrop-blur-xl w-[100%]  md:w-[41.5%] ">
        {" "}
        <span className="mt-1 cursor-pointer"></span>{" "}
        <span className="text-base  md:text-xl"> Home </span>{" "}
      </div>

      <div className="mt-16"></div>

      {data?.pages?.map((group, i) => (
        <React.Fragment key={i}>
          {group.data.map((tweet  , index ) => (
            <Suspense fallback={<div> Loading ... </div>}> 

              <TwetCARD tweet={tweet}  key={index} />

            </Suspense>
            
          ))}
        </React.Fragment>
      ))}

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

export default TodoList
