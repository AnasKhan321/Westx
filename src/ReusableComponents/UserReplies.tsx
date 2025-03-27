import { useInfiniteQuery } from "@tanstack/react-query";
import {  } from "../utils/apicalls";
import Reply2 from "./Reply2";
import Tweet4 from "./TweetCard4";
import { Tweet, User2 } from "../utils/type";
import TweetSkeleton, { TwitterSkeletonComponent } from "./TweetSkeleton";
import { motion } from "motion/react";
import { Suspense, useEffect, useRef } from "react";
import Loader2 from "./Loader2";

interface UserReplies {
  success : boolean , 
  data : Tweet[]   , 
  hasMore : boolean 
}


export const getUserReplies = async({userid , page}  : {userid : string , page : number}  )=>{
  const res  = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/allreplies/${userid}/${page}`)
  const data = await res.json();
  return {
    data: data.data,
    nextCursor: data.data.length > 0 ? page + 1 : undefined, // Stop pagination when no more data , 
    success: data.success
  }
}

const UserReplies = ({ user }: { user : User2 }) => {


  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [`user:replies:${user.id}`],
    queryFn: ({ pageParam }) => getUserReplies({ page: pageParam, userid: user.id }),
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


  if (status === 'error') return <p className="text-center text-gray-200 my-4 font-bold text-xl  ">Internal Server Error</p>
  if (status == 'pending') return <div className="mt-4">
    <TweetSkeleton />
  </div>

  const getUniqueTweets = (pages: { data: Tweet[] }[]) => {
    const seenTweets = new Set<string>();
    return pages.flatMap(group => 
      group.data.filter((tweet: Tweet) => {
        const replyKey = `${tweet.id}-${tweet.parentTweetId || ''}`;
        const isDuplicate = seenTweets.has(replyKey);
        seenTweets.add(replyKey);
        return !isDuplicate;
      })
    );
  };


  return (
    <div>
      <>
        {data?.pages?.length === 0 || data?.pages?.every(page => page?.data?.length === 0) ? (
          <p className="text-center text-gray-200 my-4 font-bold text-xl">
            No tweets to show.
          </p>
        ) : (
          <>
            {getUniqueTweets(data?.pages || []).map((item: Tweet) => (
              <Suspense
                key={`${item.id}-${item.parentTweetId || ''}`}
                fallback={
                  <div className="text-white p-4 md:w-[96%] w-full mx-auto">
                    <TwitterSkeletonComponent />
                  </div>
                }
              >
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.7 }} 
                  className="border-b border-white/20 py-4"
                >
                  {item.parentTweetId && (
                    <Tweet4 
                      createdAt={item.parentTweet?.createdAt as Date}
                      photoURL={item.parentTweet?.user.photoURL as string}
                      tweetid={item.parentTweet?.id as string}
                      content={item.parentTweet?.text as string}
                      username={item.parentTweet?.user.username as string}
                      date={""}
                      name={item.parentTweet?.user.name as string}
                    />
                  )}
                  <Reply2
                    content={item.text as string}
                    replyid={item.id}
                    username={user.username}
                    date={item.createdAt}
                    name={user.name}
                    photoURL={user.photoURL}
                    createdAt={item.createdAt}
                  />
                </motion.div>
              </Suspense>
            ))}

            {data.pages[data.pages.length - 1].data.length === 0 && (
              <div className='py-8 text-center font-bold text-xl'>
                No more Replies
              </div>
            )}
          </>
        )}

        {/* Infinite scroll elements */}
        <div ref={bottomRef} className="h-10" />
        {isFetchingNextPage && (
          <div className="flex justify-center items-start h-[14vh]">
            <Loader2 />
          </div>
        )}
      </>
    </div>
  );
};

export default UserReplies;
