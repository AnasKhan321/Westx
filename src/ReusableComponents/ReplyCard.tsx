import { Link } from "react-router-dom";
import { Tweet } from "../utils/type";
import { timeSince } from "../utils/date";
import { BiHeart, BiMessageRounded, BiRepost } from "react-icons/bi";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { addLike, CreateBookmark, CreateRepost } from "../utils/creationcall";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { DeleteBookmark, DeleteLike, DeleteRepost } from "../utils/deletioncall";



export default function ReplyCard({reply}  : {reply : Tweet}){

  const [reposts, setreposts] = useState(reply.reposts.length);
  const [likes, setlikes] = useState(reply.likes.length);
  const [bookmarks, setbookmarks] = useState(reply.bookmarks.length);

  const {user}  = useAuth() ; 

  const [islike, setislike] = useState(
    reply.likes.some((tweetl) => tweetl.userid === user?.id)
  );
  const [isBookmarked, setisBookmarked] = useState(
    reply.bookmarks.some((tweetB) => tweetB.userid === user?.id)
  );
  const [isreposted, setisreposted] = useState(
    reply.reposts.some((tweetR) => tweetR.userId === user?.id)
  );
  const queryClient = useQueryClient();

  const handleAddBookmark = async () => {
    const response = await CreateBookmark({
      userid: user?.id as string,
      tweetid: reply.id,
    });
    if (response?.success) {
      queryClient.invalidateQueries({
        queryKey: [`${user?.username}:Bookmarks`],
      });
      toast.success("BookMark added Successfully");
      setisBookmarked(true);
      setbookmarks(bookmarks + 1);
    }
  };

  const removeBookmark = async () => {
    const response = await DeleteBookmark({
      userid: user?.id as string,
      tweetid: reply.id,
    });
    if (response?.success) {
      queryClient.invalidateQueries({
        queryKey: [`${user?.username}:Bookmarks`],
      });
      toast.success("Removed Bookmark");
      setisBookmarked(false);
      setbookmarks(bookmarks - 1);
    }
  };

  const AddLike = async () => {
    const response = await addLike({
      tweetid: reply.id,
      userid: user?.id as string,
    });
    if (response?.success) {
      toast.success("Liked!");
      setislike(true);
      setlikes(likes + 1);
    }
  };

  const removeLike = async () => {
    const response = await DeleteLike({
      userid: user?.id as string,
      tweetid: reply.id,
    });
    if (response?.success) {
      toast.success("Removed Like");
      setislike(false);
      setlikes(likes - 1);
    }
  };

  const addRepost = async () => {
    const response = await CreateRepost({
      tweetid: reply.id,
      userid: user?.id as string,
    });
    if (response?.success) {
      setisreposted(true);
      setreposts(reposts + 1);
      toast.success("Reposted !");
    }
  };

  const removeRepost = async () => {
    const response = await DeleteRepost({
      tweetid: reply.id,
      userid: user?.id as string,
    });

    if (response?.success) {
      setisreposted(false);
      setreposts(reposts - 1);
      toast.success("Remove Reposted");
    }
  };



    return(
        <div>
  
        <div className="flex items-start space-x-3 p-4 w-full  ">
          <img
            src={reply.user.photoURL}
            alt={reply.user.name}
            width={48}
            height={48}
            className="rounded-full"
          />
          <div>
            <div className="flex items-center space-x-2">
              <Link to={`/user/${reply.user.username}`}>
                {" "}
                <div className="flex items-center gap-x-2">
                  <span className="font-bold  hover:underline">
                    {reply.user.name}
                  </span>{" "}
                  {reply.user.isPremium && (
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
              <Link to={`/user/${reply.user.username}`}>
                {" "}
                <span className="text-gray-400">{reply.user.username} · </span>
                <span className="text-gray-400">
                  {" "}
                  {timeSince(reply.createdAt)}{" "}
                </span>
              </Link>
            </div>
            <Link to={`/tweet/${reply.id}`}> 
            <p>{reply.text}</p>
            
            </Link>

        <div className="flex items-center justify-between w-[100%] md:w-[100%] mx-auto   mt-5 text-xl text-gray-500">
          <Link to={`/reply/${reply.id}`}>
            <div className="flex gap-x-1 group hover:text-blue-500  transition-all items-center ">
              <span className="text-sm">
                {reply.replies.length == 0 ? "" : reply.replies.length}
              </span>
              <BiMessageRounded className=" cursor-pointer  rounded-full p-2 group-hover:bg-blue-500/10   text-4xl " />
              {/* <span className="text-sm">27</span> */}
            </div>
          </Link>

          {isreposted ? (
            <div onClick={removeRepost} className="flex gap-x-1 items-center">
              <span className="text-sm">{reposts == 0 ? "" : reposts}</span>
              <BiRepost className="text-green-500 transition-all cursor-pointer   hover:bg-green-500/10 p-2 rounded-full text-4xl   " />
            </div>
          ) : (
            <div onClick={addRepost} className="flex gap-x-1 items-center">
              <span className="text-sm">{reposts == 0 ? "" : reposts}</span>
              <BiRepost className="hover:text-green-500 transition-all cursor-pointer   hover:bg-green-500/10 p-2 rounded-full text-4xl   " />
            </div>
          )}

          <div className="flex gap-x-1 group hover:text-red-500  transition-all  group items-center">
            {islike ? (
              <div onClick={removeLike} className="flex gap-x-1 items-center">
                <span className="text-sm">{likes == 0 ? "" : likes}</span>
                <BiHeart className=" text-red-500 group-hover:bg-red-500/10  cursor-pointer text-4xl p-2 rounded-full " />
              </div>
            ) : (
              <div onClick={AddLike} className="flex gap-x-1 items-center">
                <span className="text-sm">{likes == 0 ? "" : likes}</span>
                <BiHeart className="group-hover:bg-red-500/10  cursor-pointer text-4xl p-2 rounded-full " />
              </div>
            )}
            {/* <span className="text-sm">27</span> */}
          </div>

          {isBookmarked ? (
            <div onClick={removeBookmark} className="flex gap-x-1 items-center">
              <span className="text-sm">{bookmarks == 0 ? "" : bookmarks}</span>
              <FaBookmark className="text-territary cursor-pointer hover:bg-blue-500/10 text-4xl p-2" />
            </div>
          ) : (
            <div
              className="flex items-center gap-x-1  text-gray-500"
              onClick={handleAddBookmark}
            >
              <span className="text-sm">{bookmarks == 0 ? "" : bookmarks}</span>
              <FaRegBookmark className="hover:text-territary cursor-pointer hover:bg-blue-500/10 text-4xl p-2" />
            </div>
          )}
          {/* <MdOutlineIosShare  className="hover:text-blue-500 font-bold  cursor-pointer    hover:bg-blue-500/10 text-4xl p-2 rounded-full" /> */}
        </div>
          </div>
        </div>


        </div>
    )
}