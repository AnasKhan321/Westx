import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { Suspense, useEffect, useRef } from 'react'

import SmallLoader from '../ReusableComponents/SmallLoader'
import TweetSkeleton from './TweetSkeleton'
import { ColorRing } from 'react-loader-spinner'
import { SupabaseTweet } from '../ReusableComponents/SupabaseTweet'


const TwetCARD = React.lazy(() => import("../ReusableComponents/SupabaseTweet"));

interface TweetResponse {
  success: boolean
  data: SupabaseTweet[]
  hasMore: boolean // API must return this
}

const fetchTweets = async ({ pageParam = 1, userId }: { pageParam?: number, userId: string }) => {
  const { data } = await axios.get<TweetResponse>(
    `${import.meta.env.VITE_PUBLIC_AI_URL}/api/supabase/getTweets/${userId}/${pageParam}`
  );

  return {
    data: data.data,
    nextCursor: data.data.length > 0 ? pageParam + 1 : undefined, // Stop pagination when no more data
  };
};

function UserTweets({ userId }: { userId: string }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['tweets', userId], // Include userId in query key
    queryFn: ({ pageParam }) => fetchTweets({ pageParam, userId }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 1,
    enabled: !!userId,
  });


  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!bottomRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {

        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px", threshold: 0.5 } 
    );

    const currentRef = bottomRef.current;
    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === 'error') return <p className="font-bold text-center mt-5">Internal Server Error Try Again</p>;
  if (status === 'pending') return <TweetSkeleton />


  return (
    <>


      <div className="mt-2"></div>


      {data?.pages?.map((group, i) => (
        <React.Fragment key={i}>
          {group.data.length == 0 && <> <div className='py-8 text-center font-bold text-xl'> No more Posts </div>  </>}
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

        <div className=" flex justify-center items-start h-[14vh] ">
          <ColorRing
            visible={true}
            height="40"
            width="40"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={["#9915eb", "#9915eb", "#9915eb", "#9915eb", "#9915eb"]}
          />
        </div>


      )}
    </>
  );
}

export default UserTweets;
