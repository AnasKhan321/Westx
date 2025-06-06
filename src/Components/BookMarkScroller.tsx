import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { Suspense, useEffect, useRef } from "react";
import { BookMark } from "../utils/type";
import { useAuth } from "../Context/AuthContext";
import { IoCaretBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import TweetSkeleton, { TwitterSkeletonComponent } from "../ReusableComponents/TweetSkeleton";
import Loader2 from "../ReusableComponents/Loader2";
import SEO from "../ReusableComponents/SEO";
import { FaBookmark, FaCompass } from 'react-icons/fa'

const TweetCardBookmark = React.lazy(
  () => import("../ReusableComponents/TweetCardBookmark")
);
interface BookMarkResponse {
  success: boolean;
  data: BookMark[];
  hasMore: boolean;
}

const fetchBookMarks = async ({
  pageParam = 1,
  userid,
}: {
  pageParam: number;
  userid: string | undefined;
}) => {
  const { data } = await axios.get<BookMarkResponse>(
    `${import.meta.env.VITE_PUBLIC_AI_URL
    }/api/user/bookmark/${userid}/${pageParam}`
  );

  return {
    data: data.data,
    nextCursor: data.data.length > 0 ? pageParam + 1 : undefined, // Stop pagination when no more data
  };
};

function BookMarks() {
  const { user } = useAuth();
  const {
    data,

    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [`${user?.username}:Bookmarks`], // Include userid in the query key to refetch when it changes
    queryFn: ({ pageParam }) => fetchBookMarks({ pageParam, userid: user?.id }), // Pass pageParam and userid properly
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: 1,
  
  });

  const navigate = useNavigate();
  const handleClick = () => {
    navigate(-1);
  };

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
      { threshold: 0.1 } // Trigger when 100% visible
    );

    observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Add this function to filter out duplicates
  const getUniqueTweets = (pages: any[]) => {
    const seenTweets = new Set();
    const uniqueTweets = pages.flatMap(group => 
      group.data.filter((tweet: BookMark) => {
        const isDuplicate = seenTweets.has(tweet.id);
        seenTweets.add(tweet.id);
        return !isDuplicate;
      })
    );
    return uniqueTweets;
  };

  if (status === "error") return <p className="font-bold text-center mt-5">Internal Server Error Try Again</p>;
  if (status == "pending")
    return (
      <div className="w-full min-h-screen max-h-screen   md:min-h-[98vh] md:max-h-[98vh] overflow-y-scroll md:mt-[2vh] z-10    bg-primaryColor md:bg-secondaryColor rounded-l-2xl border-white/10 border-2 ">
        <div className="flex  absolute p-4 items-center bg-secondaryColor/20 space-x-2 backdrop-blur-xl z-10  w-full  md:w-[49.9%] md:rounded-xl font-bold   ">
          <IoCaretBack
            className="text-xl cursor-pointer"
            onClick={handleClick}
          />
          <span>Bookmarks</span>
        </div>
        <div className="mt-6"></div>
        <TweetSkeleton />

      </div>
    );

  return (
    <>
    <SEO title={ `Bookmarks - ${user?.username} `} description={"Bookmarks page where you can see all your bookmarked tweets"} />
      <div className="w-full min-h-screen max-h-screen md:min-h-[98vh] md:max-h-[98vh] overflow-y-scroll md:mt-[2vh]  border border-white/10   bg-primaryColor  md:bg-newcolor2 rounded-l-xl ">
        <div className="flex absolute p-4 items-center space-x-2   backdrop-blur-xl     w-full  md:w-[49.8%]  md:rounded-xl font-bold   ">
          <IoCaretBack
            className="text-xl cursor-pointer"
            onClick={handleClick}
          />
          <span>Bookmarks</span>
        </div>




        <div className=" mt-16">
          {data?.pages?.length === 0 ||
            data?.pages?.every((page) => page?.data?.length === 0) ? (
            <div className="text-center text-gray-200 mt-12 h-[50vh] flex flex-col justify-center items-center space-y-6">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-purple-600/20 rounded-full flex items-center justify-center">
                <FaBookmark className="text-2xl lg:text-4xl text-purple-500" />
              </div>
              <div className="space-y-3">
                <div className=" text-xl lg:text-3xl font-bold bg-clip-text text-white">
                  Your Bookmarks are Empty
                </div>
                <div className="text-gray-400 max-w-sm lg:max-w-md text-center leading-relaxed">
                  Save tweets you love to read them later! Bookmark interesting posts, articles, and updates to build your personal collection.
                </div>
              </div>
              <button 
                onClick={() => navigate('/')}
                className="mt-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white rounded-full transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <FaCompass className=" text-base lg:text-lg" />
                <span>Explore Content</span>
              </button>
            </div>
          ) : (
            getUniqueTweets(data?.pages || []).map((tweet) => (
              <Suspense
                key={tweet.Tweet.id}
                fallback={
                  <div className="w-full p-4 md:w-[96%]">
                    <TwitterSkeletonComponent />
                  </div>
                }
              >
                <TweetCardBookmark tweet={tweet.Tweet} />
              </Suspense>
            ))
          )}
        </div>

        {/* Invisible div to track scrolling and auto-load new data */}
        <div ref={bottomRef} className="h-10" />

        {isFetchingNextPage && (

          <div className=" flex justify-center items-start h-[14vh] ">
            <Loader2 />
          </div>


        )}
      </div>
    </>
  );
}

export default BookMarks;
