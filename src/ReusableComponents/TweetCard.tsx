import { BiMessageRounded, BiRepost } from "react-icons/bi";
import { Tweet } from "../utils/type";
import { Link } from "react-router-dom";
import { timeSince } from "../utils/date";
import { useAuth } from "../Context/AuthContext";
import { addLike, CreateBookmark, CreateRepost } from "../utils/creationcall";
import toast from "react-hot-toast";
import {
  DeleteBookmark,
  DeleteLike,
} from "../utils/deletioncall";
import { useState } from "react";
import { DynamicText } from "./DynamicText";
import { useQueryClient } from "@tanstack/react-query";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { IoBookmark } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import { ColorRing } from "react-loader-spinner";
import { useApp } from "../Context/ActivityContext";
import SafeImage from "./SafeImage";
import { motion } from "motion/react";

const SmallestLoader = () => {
  return (
    <div className="bg-neutral-700 rounded-full p-2 text-white">
      <ColorRing
        visible={true}
        height="20"
        width="20"
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={["#9915eb", "#9915eb", "#9915eb", "#9915eb", "#9915eb"]}
      />
    </div>
  );
};

const TweetCard = ({
  tweet,
  isBookmark,
}: {
  tweet: Tweet;
  isBookmark: boolean;
}) => {
  const queryClient = useQueryClient();

  const { user   , isAuthenticated } = useAuth();

  const [reposts, setreposts] = useState(tweet.reposts.length);
  const [likes, setlikes] = useState(tweet.likes.length);
  const [bookmarks, setbookmarks] = useState(tweet.bookmarks.length);

  const [isliker, setisliker] = useState(false);
  const [isbookmarker, setisbookmarker] = useState(false);
  const [isreposter, setisreposter] = useState(false);

  const [islike, setislike] = useState(
    tweet.likes.some((tweetl) => tweetl.userid === user?.id)
  );
  const [isBookmarked, setisBookmarked] = useState(
    tweet.bookmarks.some((tweetB) => tweetB.userid === user?.id)
  );
  const [isreposted, setisreposted] = useState(
    tweet.reposts.some((tweetR) => tweetR.userId === user?.id)
  );

  const { contextlikes, setcontextlikes, contextreposts, setcontextreposts, contextbookmarks, setcontextbookmarks, removecontextlikes, setremovecontextlikes, removecontextbookmarks, setremovecontextbookmarks } = useApp()



  const handleAddBookmark = async () => {

    if (isbookmarker) {
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login to add bookmark", {
        style: {
          borderRadius: '20px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }

    setisbookmarker(true);
    const response = await CreateBookmark({
      userid: user?.id as string,
      tweetid: tweet.id,
    });
    if (response?.success) {
      queryClient.invalidateQueries({
        queryKey: [`${user?.username}:Bookmarks`],
      });
      toast.success("BookMark added Successfully", {
        style: {
          borderRadius: '20px',
          background: '#333',
          color: '#fff',
        },

      });
      setisBookmarked(true);
      setbookmarks(bookmarks + 1);
      setcontextbookmarks([...contextbookmarks, tweet.id])
      setremovecontextbookmarks(removecontextbookmarks.filter((id) => id !== tweet.id))
    }
    setisbookmarker(false);
  };

  const removeBookmark = async () => {
    if (isbookmarker) {
      return;
    }
    setisbookmarker(true)
    const response = await DeleteBookmark({
      userid: user?.id as string,
      tweetid: tweet.id,
    });
    if (response?.success) {
      queryClient.invalidateQueries({
        queryKey: [`${user?.username}:Bookmarks`],
      });
      toast.success("Removed Bookmark", {
        style: {
          borderRadius: '20px',
          background: '#333',
          color: '#fff',
        },

      });
      setisBookmarked(false);
      if (bookmarks > 0) {
        setbookmarks(bookmarks - 1);
      }
      setcontextbookmarks(contextbookmarks.filter((id) => id !== tweet.id))
      setremovecontextbookmarks([...removecontextbookmarks, tweet.id])
    }
    setisbookmarker(false)
  };

  const AddLike = async () => {
    if (isliker) {
      return;
    }
    if (!isAuthenticated) {
      toast.error("Please login to add Like", {
        style: {
          borderRadius: '20px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }
    setisliker(true);
    const response = await addLike({
      tweetid: tweet.id,
      userid: user?.id as string,
    });
    if (response?.success) {
      queryClient.invalidateQueries({
        queryKey: ["tweets"],
      });
      toast.success("Liked!", {
        style: {
          borderRadius: '20px',
          background: '#333',
          color: '#fff',
        },


      });

      setremovecontextlikes(removecontextlikes.filter((id) => id !== tweet.id))
      setcontextlikes([...contextlikes, tweet.id])

      setislike(true);
      setlikes(likes + 1);


    }

    setisliker(false);
  };

  const removeLike = async () => {
    if (isliker) {
      return;
    }
    setisliker(true)
    const response = await DeleteLike({
      userid: user?.id as string,
      tweetid: tweet.id,
    });
    if (response?.success) {
      queryClient.invalidateQueries({
        queryKey: ["tweets"],
      });
      toast.success("Removed Like", {
        style: {
          borderRadius: '20px',
          background: '#333',
          color: '#fff',
        },

      });
      setcontextlikes(contextlikes.filter((id) => id !== tweet.id))
      setislike(false);
      setremovecontextlikes([...removecontextlikes, tweet.id])
      if (likes > 0) {
        setlikes(likes - 1);
      }

    }
    setisliker(false)
  };

  const addRepost = async () => {
    if (isreposter) {
      return;
    }
    if (!isAuthenticated) {
      toast.error("Please login to add repost", {
        style: {
          borderRadius: '20px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }

    setisreposter(true);
    const response = await CreateRepost({
      tweetid: tweet.id,
      userid: user?.id as string,
    });
    if (response?.success) {
      queryClient.invalidateQueries({
        queryKey: ["tweets"],
      });
      setisreposted(true);
      setreposts(reposts + 1);
      toast.success("Reposted !", {
        style: {
          borderRadius: '20px',
          background: '#333',
          color: '#fff',
        },

      });
      setcontextreposts([...contextreposts, tweet.id])
    }
    setisreposter(false);
  };



  return (
    <motion.div initial={{opacity : 0 , y:10  }} animate={{opacity : 1 , y:0  }} transition={{duration : 0.7}} className=" text-white w-full  md:w-[96%]  grid  grid-cols-18  mx-auto  py-4 px-2   md:p-4 border-b border-white/20  ">
      <div className=" col-span-3  tablet:col-span-3 md:col-span-2  xl:col-span-2 3xl:col-span-1">
        <SafeImage
          src={tweet.user.photoURL}
          width={48}
          height={48}
          className="rounded-full"
        />
      </div>

      <div className=" col-span-15 tablet:col-span-15 md:col-span-16  xl:col-span-16 3xl:col-span-17">
        <div className="flex items-center space-x-2 ">
          <Link to={`/user/${tweet.user.username}`}>
            {" "}
            <div className="flex items-center gap-x-2">
              <span className=" text-sm md:text-base font-semibold  hover:underline">
                {tweet.user.name}
              </span>{" "}
              {tweet.user.isPremium && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#a200e8"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </Link>
          <Link to={`/user/${tweet.user.username}`}>
            {" "}
            <span className="text-[12px]  text-gray-400 md:text-base ">
              {tweet.user.username} ·{" "}
            </span>
            <span className="text-[12px] text-gray-400  md:text-base ">
              {" "}
              {timeSince(tweet.createdAt)}{" "}
            </span>
          </Link>
        </div>
        <Link to={`/tweet/${tweet.id}`} className="text-[12px] md:text-base">
          <DynamicText text={tweet.text as string} postedBy="assistant" />
        </Link>

        {tweet.image && (
          <div className="mt-4 w-full">
            <LazyLoadImage
              src={tweet.image}

              className="w-full h-auto rounded-lg"
            />
          </div>
        )}

        {!isBookmark && (
          <div className="flex items-center justify-between w-full  xl:w-[60%]     mt-5  text-xl text-gray-500">
            <Link to={`/tweet/${tweet.id}`}>
              <div className="flex gap-x-1 group hover:text-blue-500  transition-all items-center ">
                <span className="text-sm">
                  {tweet.replies.length == 0 ? "" : tweet.replies.length}
                </span>
                <BiMessageRounded className=" cursor-pointer  rounded-full p-2 text-white hover:bg-neutral-800 transition-all   bg-neutral-700    text-4xl " />
              </div>
            </Link>

            {isreposted || contextreposts.some((id) => id === tweet.id) ? (
              <div className="flex gap-x-1 items-center">
                <span className="text-sm">{reposts == 0 ? "" : reposts}</span>
                <BiRepost className=" text-green-500    bg-neutral-700  transition-all cursor-pointer   hover:bg-neutral-800  p-2 rounded-full text-4xl   " />
              </div>
            ) : (
              <div onClick={addRepost} className="flex gap-x-1 items-center">
                <span className="text-sm">{reposts == 0 ? "" : reposts}</span>
                {isreposter ? (
                  <SmallestLoader />
                ) : (
                  <BiRepost className=" transition-all cursor-pointer  text-white  hover:bg-neutral-800     bg-neutral-700 p-2 rounded-full text-4xl   " />
                )}
              </div>
            )}

            <div className="flex gap-x-1 group   transition-all  group items-center">
              {islike || contextlikes.some((id) => id === tweet.id) ? (




                <>


                  {removecontextlikes.some((id) => id === tweet.id) ? (
                    <div onClick={AddLike} className="flex gap-x-1 items-center">


                      <span className="text-sm"> {likes - 1 == 0 ? "" : likes}</span>
                      {isliker ? (
                        <SmallestLoader />
                      ) : (
                        <FaRegHeart className="group-hover:bg-neutral-800 text-white transition-all   bg-neutral-700   cursor-pointer text-4xl p-2 rounded-full " />
                      )}
                    </div>
                  ) : (
                    <>

                      <div onClick={removeLike} className="flex gap-x-1 items-center">

                        <span className="text-sm"> {likes == 0 ? 1 : likes}</span>

                        {isliker ? (
                          <SmallestLoader />
                        ) : (
                          <FaHeart className=" text-red-500 group-hover:bg-neutral-800  transition-all    bg-neutral-700   cursor-pointer text-4xl p-2 rounded-full " />
                        )}
                      </div>
                    </>)

                  }




                </>
              ) : (
                <div onClick={AddLike} className="flex gap-x-1 items-center">


                  <span className="text-sm"> {likes == 0 ? "" : likes}</span>
                  {isliker ? (
                    <SmallestLoader />
                  ) : (
                    <FaRegHeart className="group-hover:bg-neutral-800 text-white transition-all   bg-neutral-700   cursor-pointer text-4xl p-2 rounded-full " />
                  )}
                </div>
              )}
            </div>

            {isBookmarked || contextbookmarks.some((id) => id === tweet.id) ? (


              <>

                {removecontextbookmarks.some((id) => id === tweet.id) ? (
                  <div
                    className="flex items-center gap-x-1  text-gray-500"
                    onClick={handleAddBookmark}
                  >
                    <span className="text-sm">
                      {bookmarks == 0 ? "" : bookmarks}
                    </span>
                    {isbookmarker ? (
                      <SmallestLoader />
                    ) : (
                      <IoBookmarkOutline className=" text-white  transition-all   bg-neutral-700 rounded-full cursor-pointer hover:bg-neutral-800 text-4xl p-2" />
                    )}
                  </div>




                ) : (

                  <div
                    onClick={removeBookmark}
                    className="flex gap-x-1 items-center"
                  >
                    <span className="text-sm">
                      {bookmarks == 0 ? 1 : bookmarks}
                    </span>
                    {isbookmarker ? (
                      <SmallestLoader />
                    ) : (
                      <IoBookmark className="text-territary rounded-full  transition-all  bg-neutral-700  cursor-pointer hover:bg-neutral-800 text-4xl p-2" />
                    )}
                  </div>

                )}



              </>
            ) : (
              <div
                className="flex items-center gap-x-1  text-gray-500"
                onClick={handleAddBookmark}
              >
                <span className="text-sm">
                  {bookmarks == 0 ? "" : bookmarks}
                </span>
                {isbookmarker ? (
                  <SmallestLoader />
                ) : (
                  <IoBookmarkOutline className=" text-white  transition-all   bg-neutral-700 rounded-full cursor-pointer hover:bg-neutral-800 text-4xl p-2" />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TweetCard;
