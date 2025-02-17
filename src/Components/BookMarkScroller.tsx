import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { Suspense, useEffect, useRef } from 'react'
import { BookMark } from '../utils/type'
import SmallLoader from '../ReusableComponents/SmallLoader'
import Loader from '../ReusableComponents/Loader'
import { useAuth } from '../Context/AuthContext'
const TweetCardBookmark =  React.lazy(() => import("../ReusableComponents/TweetCardBookmark"));
interface BookMarkResponse {
  success: boolean
  data: BookMark[]
  hasMore: boolean 
}

const fetchBookMarks = async ({ pageParam = 1   , userid}  : {pageParam : number , userid : string | undefined}) => {
  const { data } = await axios.get<BookMarkResponse>(
    `${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/bookmark/${userid}/${pageParam}`
  )

  return {
    data: data.data,
    nextCursor: data.data.length > 0 ? pageParam + 1 : undefined, // Stop pagination when no more data
  }
}

function BookMarks() {
  const {user}  =useAuth() 
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [`foryou:tweets:${user?.id}`], // Include userid in the query key to refetch when it changes
    queryFn: ({ pageParam }) => fetchBookMarks({ pageParam, userid: user?.id }), // Pass pageParam and userid properly
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
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
      { threshold: 0.1 } // Trigger when 100% visible
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
      <p className="text-center text-gray-200 my-4 font-bold text-xl  ">No BookMarks to show.</p>
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
            <TweetCardBookmark key={tweet.id} tweet={tweet.tweet}/> 
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

export default BookMarks
