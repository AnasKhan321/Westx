import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Tweet } from "../utils/type";
import { useInfiniteQuery } from "@tanstack/react-query";
import Loader2 from "../ReusableComponents/Loader2";
import TweetSkeleton, { TwitterSkeletonComponent } from "../ReusableComponents/TweetSkeleton";
import { Suspense, useEffect, useRef } from "react";
import React from "react";
import { BiRepost } from "react-icons/bi";
import { IoCaretBack } from "react-icons/io5";
import { capitalizeFirstLetter } from "../utils/getUserPosition";



interface TopicTweetsResponse {
    success: boolean;
    data: Tweet[];
    hasMore: boolean;
}


const getTweets = async ({ topic, pageParam = 1 }: { topic: string, pageParam: number }) => {
    const data = await axios.get<TopicTweetsResponse>(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/tweet/topic/${topic}/${pageParam}`)
    if (data.data.success) {
        return {
            data: data.data.data,
            nextCursor: data.data.hasMore ? pageParam + 1 : null, // Ensure null instead of undefined if no more pages
        };
    } else {
        throw new Error("Something Went Wrong Try Again!")
    }


}

const TwetCARD = React.lazy(() => import("../ReusableComponents/TweetCard"));
const TopicsTweets = () => {
    const { topic } = useParams();


    const navigate = useNavigate();
    const handleClick = () => {
        navigate(-1);
    };
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: [`TWEETS:${topic}`],
        queryFn: ({ pageParam }) => getTweets({ pageParam, topic: topic as string }),
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined, // Ensures undefined if no more pages
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


    if (status === 'error') return (
        <div className="w-full min-h-screen max-h-screen   md:min-h-[96vh] md:max-h-[96vh] overflow-y-scroll md:my-[2vh] z-10    bg-primaryColor md:bg-secondaryColor rounded-2xl  border-2 border-white/10">
            <p className="text-center text-gray-200 my-4 font-bold text-xl  ">   {error.message} </p>
        </div>
    );

    if (status === "pending") {

        return (
            <div className="w-full min-h-screen max-h-screen   md:min-h-[98vh] md:max-h-[98vh] overflow-y-scroll md:mt-[2vh] z-10    bg-primaryColor md:bg-secondaryColor rounded-2xl  border-2 border-white/10">
                <div className="flex   absolute p-4 items-center space-x-2   backdrop-blur-xl  z-10   bg-primaryColor md:bg-secondaryColor w-full  md:w-[49.9%] md:rounded-xl font-bold   ">
                    <IoCaretBack
                        className="text-xl cursor-pointer"
                        onClick={handleClick}
                    />
                    <span>{capitalizeFirstLetter(topic as string)}</span>
                </div>
                <div className="mt-6"></div>
                <TweetSkeleton />

            </div>
        );
    }




    return (

        <div className="max-h-screen min-h-screen bg-primaryColor md:bg-secondaryColor md:mt-[2vh]  md:border md:border-white/10  md:max-h-[98vh]  md:min-h-[98vh]  md:rounded-l-2xl overflow-y-scroll ">

            <div className="flex   absolute p-4 items-center space-x-2   backdrop-blur-xl     bg-secondaryColor/20 w-full  md:w-[49.8%]  md:rounded-xl font-bold   ">
                <IoCaretBack
                    className="text-xl cursor-pointer"
                    onClick={handleClick}
                />
                <span>{capitalizeFirstLetter(topic as string)}</span>
            </div>
            <>


                <div className=" mt-14"></div>

                {data?.pages?.length === 0 || data?.pages?.every(page => page?.data?.length === 0) ? (
                    <p className="text-center text-gray-200 mt-16 font-bold text-xl  ">No tweets to show.</p>
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
                                    {tweet.tweettype === "REPOST" ? (
                                        <>
                                            <div className="flex items-center pl-8 py-2 space-x-2 text-gray-500 font-bold">
                                                <BiRepost className="text-xl" />
                                                <span className="text-xs">{tweet.user.name} reposted</span>
                                            </div>
                                            <TwetCARD tweet={tweet} isBookmark={false} />
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

                    <div className=" flex justify-center items-start h-[14vh] ">
                        <Loader2 />
                    </div>


                )}
            </>
        </div>
    )
}



export default TopicsTweets
