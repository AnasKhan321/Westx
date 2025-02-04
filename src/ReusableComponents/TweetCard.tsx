import { BiHeart, BiMessageRounded, BiRepost } from "react-icons/bi";
import { Tweet } from "../utils/type";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { Link } from "react-router-dom";
import { timeSince } from "../utils/date";
import { useAuth } from "../Context/AuthContext";
import { addLike, CreateBookmark, CreateRepost } from "../utils/creationcall";
import toast from "react-hot-toast";
import { DeleteBookmark, DeleteLike, DeleteRepost } from "../utils/deletioncall";
import { useState } from "react";
import { DynamicText } from "./DynamicText";
import { useQueryClient } from "@tanstack/react-query";
import { LazyLoadImage } from "react-lazy-load-image-component";
const TweetCard = ({ tweet  , isBookmark }: { tweet: Tweet  , isBookmark : boolean }) => {
  const queryClient = useQueryClient();

  const { user } = useAuth();


  const [reposts , setreposts]  = useState(tweet.repost.length)
  const [likes , setlikes ]  = useState(tweet.likes.length)
  const [bookmarks , setbookmarks ]  = useState(tweet.bookmarks.length)

  const [islike , setislike]  = useState(tweet.likes.some((tweetl)=> tweetl.userid === user?.id))
  const [isBookmarked , setisBookmarked]  = useState(tweet.bookmarks.some((tweetB)=> tweetB.userid === user?.id))
  const [isreposted , setisreposted]  = useState(tweet.repost.some((tweetR)=> tweetR.userid === user?.id) )

  const handleAddBookmark = async () => {
    const response = await CreateBookmark({
      userid: user?.id as string,
      tweetid: tweet.id,
    });
    if (response?.success) {
      queryClient.invalidateQueries({ queryKey: [`${user?.username}:Bookmarks`] });
      toast.success("BookMark added Successfully");
      setisBookmarked(true)
      setbookmarks(bookmarks+1)
    }
  };

  const removeBookmark = async () => {

    const response = await  DeleteBookmark({userid : user?.id as string , tweetid : tweet.id})
    if(response?.success){
      queryClient.invalidateQueries({ queryKey: [`${user?.username}:Bookmarks`] });
      toast.success("Removed Bookmark")
      setisBookmarked(false)
      setbookmarks(bookmarks-1)
      
    }
  };

  const AddLike = async () => {
    const response = await addLike({
      tweetid: tweet.id,
      userid: user?.id as string,
    });
    if (response?.success) {
      toast.success("Liked!");
      setislike(true)
      setlikes(likes+1)
    }
  };

  const removeLike = async () => {

    const response = await DeleteLike({userid : user?.id as string , tweetid : tweet.id})
    if(response?.success){
      toast.success("Removed Like")
      setislike(false)
      setlikes(likes-1)
    }
  };

  const addRepost = async () => {
    const response = await CreateRepost({
      tweetid: tweet.id,
      userid: user?.id as string,
    });
    if (response?.success) {
      setisreposted(true)
      setreposts(reposts+1)
      toast.success("Reposted !");
    }
  };


  const removeRepost = async()=>{
    const response = await DeleteRepost({tweetid : tweet.id , userid : user?.id as string})

    if (response?.success) {
      setisreposted(false)
      setreposts(reposts-1)
      toast.success("Remove Reposted")
    }
  }
  

  return (
    <div className="bg-black text-white w-full  mx-auto p-4 rounded-lg border-b border-borderColor ">
      {/* Header */}

      <Link to={`/tweet/${tweet.id}`}>
        <div className="flex items-start space-x-3">
          <img
            src={tweet.user.photoURL}
            alt={tweet.user.name}
            width={48}
            height={48}
            className="rounded-full"
          />
          <div>
            <div className="flex items-center space-x-2">
              <Link to={`/user/${tweet.user.username}`}>
                {" "}
                <div className="flex items-center gap-x-2">
                  <span className=" text-sm md:text-base font-bold  hover:underline">
                    {tweet.user.name}
                  </span>{" "}
                  {tweet.user.isPremium && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#db12ff"
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
                <span className="text-[12px]  text-gray-400 md:text-base ">{tweet.user.username} · </span>
                <span className="text-[12px] text-gray-400  md:text-base ">
                  {" "}
                  {timeSince(tweet.createdAt)}{" "}
                </span>
              </Link>
            </div>
            <p className="text-[12px] md:text-base"><DynamicText text={tweet.text  as string}  postedBy="assistant"/></p>
          </div>
        </div>
      </Link>

      {/* Media */}
      {tweet.image && (
        <div className="mt-4 flex items-center justify-center">
  
  <LazyLoadImage
      src={tweet.image}
      alt="Lazy Loaded Image"
      width={500}
      height={350}
      
             
    />
        </div>
      )}

{!isBookmark && 
 
      <div className="flex items-center justify-between w-[100%] md:w-[90%] mx-auto   mt-5 text-xl text-gray-500">
        <div className="flex gap-x-1 group hover:text-blue-500  transition-all items-center ">
        <span className="text-sm">{tweet.replies.length == 0? ""  : tweet.replies.length}</span>
          <BiMessageRounded className=" cursor-pointer  rounded-full p-2 group-hover:bg-blue-500/10   text-4xl " />
          {/* <span className="text-sm">27</span> */}
        </div>

        {isreposted? (
          <div onClick={removeRepost}   className="flex gap-x-1 items-center" >
            <span className="text-sm">{reposts == 0 ? ""  : reposts}</span>
            <BiRepost className="text-green-500 transition-all cursor-pointer   hover:bg-green-500/10 p-2 rounded-full text-4xl   " />
          </div>
        ) : (
          <div  onClick={addRepost} className="flex gap-x-1 items-center">
                        <span className="text-sm">{reposts == 0 ? ""  : reposts}</span>
            <BiRepost className="hover:text-green-500 transition-all cursor-pointer   hover:bg-green-500/10 p-2 rounded-full text-4xl   " />
          </div>
        )}

        <div className="flex gap-x-1 group hover:text-red-500  transition-all  group items-center">
          {islike ? (
            <div onClick={removeLike}   className="flex gap-x-1 items-center" >
                          <span className="text-sm">{likes == 0 ? ""  : likes}</span>
              <BiHeart className=" text-red-500 group-hover:bg-red-500/10  cursor-pointer text-4xl p-2 rounded-full " />
            </div>
          ) : (
            <div onClick={AddLike}   className="flex gap-x-1 items-center" >
                       <span className="text-sm">{likes == 0 ? ""  : likes}</span>
              <BiHeart className="group-hover:bg-red-500/10  cursor-pointer text-4xl p-2 rounded-full " />
            </div>
          )}
          {/* <span className="text-sm">27</span> */}
        </div>

        {isBookmarked ? (
          <div onClick={removeBookmark}   className="flex gap-x-1 items-center">
                     <span className="text-sm">{bookmarks == 0 ? ""  : bookmarks}</span>
            <FaBookmark className="text-territary cursor-pointer hover:bg-blue-500/10 text-4xl p-2" />
          </div>
        ) : (
          <div
            className="flex items-center gap-x-1  text-gray-500"
            onClick={handleAddBookmark}
          >
                                 <span className="text-sm">{bookmarks == 0 ? ""  : bookmarks}</span>
            <FaRegBookmark className="hover:text-territary cursor-pointer hover:bg-blue-500/10 text-4xl p-2" />
          </div>
        )}
        {/* <MdOutlineIosShare  className="hover:text-blue-500 font-bold  cursor-pointer    hover:bg-blue-500/10 text-4xl p-2 rounded-full" /> */}
      </div>}
    </div>
  );
};

export default TweetCard;
