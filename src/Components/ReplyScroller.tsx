import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { Suspense, useEffect, useRef } from 'react'
import { Tweet } from '../utils/type'
import TweetSkeleton from '../ReusableComponents/TweetSkeleton'
import Loader2 from '../ReusableComponents/Loader2'

interface BookMarkResponse {
  success: boolean
  data: Tweet[]

}

const TwetCARD = React.lazy(() => import("../ReusableComponents/TweetCard"));

const fetchReply = async ({ pageParam = 1, tweetid }: { pageParam: number, tweetid: string | undefined }) => {
  const { data } = await axios.get<BookMarkResponse>(
    `${import.meta.env.VITE_PUBLIC_AI_URL}/api/tweet/reply/${tweetid}/${pageParam}`
  )


  return {
    data: data.data,
    nextCursor: data.data.length > 0 ? pageParam + 1 : undefined, // Stop pagination when no more data
  }
}

function TweetReply({ tweetid }: { tweetid: string }) {

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [`Replies:Tweet:${tweetid}`], // Include userid in the query key to refetch when it changes
    queryFn: ({ pageParam }) => fetchReply({ pageParam, tweetid: tweetid }), // Pass pageParam and userid properly
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 1,
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

  if (status === 'error') return <p className='font-bold text-center mt-4 '>Internal Server Error </p>
  if (status == 'pending') return <TweetSkeleton />



  return (
    <>


      {data?.pages?.length === 0 || data?.pages?.every(page => page?.data?.length === 0) ? (
        <p className="text-center text-gray-200 my-4 font-bold text-xl  "></p>
      ) : (
        data?.pages?.map((group, i) => (
          <React.Fragment key={i}>
            {group?.data?.map((tweet) => (
              <Suspense
                key={tweet.id}  // ✅ Key should be on Suspense, not inside it
                fallback={
                  <div className="text-center my-4">
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

export default TweetReply