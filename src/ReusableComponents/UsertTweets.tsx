import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { Suspense, useEffect, useRef } from 'react'
import { Tweet } from '../utils/type'
import SmallLoader from '../ReusableComponents/SmallLoader'
import Loader from '../ReusableComponents/Loader'

const TwetCARD = React.lazy(() => import("../ReusableComponents/TweetCard"));

interface TweetResponse {
  success: boolean
  data: Tweet[]
  hasMore: boolean // API must return this
}

const fetchTweets = async ({ pageParam = 1, userId }: { pageParam?: number, userId: string }) => {
  const { data } = await axios.get<TweetResponse>(
    `${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/tweet/v2/${userId}/${pageParam}`
  );

  return {
    data: data.data,
    nextCursor: data.data.length > 0 ? pageParam + 1 : undefined, // Stop pagination when no more data
  };
};

function UserTweets({ userId }: { userId: string }) { 
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['tweets', userId], // Include userId in query key
    queryFn: ({ pageParam }) => fetchTweets({ pageParam, userId }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 1,
    enabled: !!userId, // Only run query if userId is available
  });

  // Ref to track the intersection observer
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!bottomRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage(); // Automatically load more
        }
      },
      { threshold: 1.0 } // Trigger when 100% visible
    );

    observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === 'error') return <p>Error: {error.message}</p>;
  if (status === 'pending') return <Loader />;
  console.log(data)

  return (
    <>


      <div className="mt-2"></div>


      {data?.pages?.map((group, i) => (
        <React.Fragment key={i}>
          {group.data.length == 0  && <> <div className='py-8 text-center font-bold text-xl'> No more Posts </div>  </> }
          {group.data.map((tweet, index) => (
            <Suspense key={index} fallback={<div className='text-center my-4'><SmallLoader /></div>}>
              <TwetCARD tweet={tweet} isBookmark={false} />
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
  );
}

export default UserTweets;
