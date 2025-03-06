import { BiHeart, BiMessageRounded, BiRepost } from "react-icons/bi";
import { Tweet, User } from "../utils/type";
import { MdOutlineIosShare } from "react-icons/md";
import { FaRegBookmark } from "react-icons/fa";

import { Link } from "react-router-dom";
import { timeSince } from "../utils/date";
import { LazyLoadImage } from "react-lazy-load-image-component";


const TweetCardforuserTweet = ({
  tweet,
  user,
}: {
  tweet: Tweet;
  user: User;
}) => {
  return (
    <Link to={`/tweet/${tweet.id}`}>
      <div className="bg-primaryColor text-white w-full  mx-auto p-4 rounded-lg border-b border-borderColor ">
        {/* Header */}
        <div className="flex items-start space-x-3">
          <img
            src={user.photoURL}
            alt={user.name}
            width={48}
            height={48}
            className="rounded-full"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold">{user.name}</span>
              <Link to={`/user/${user.username}`}>
                {" "}
                <span className="text-gray-400">{user.username} · </span>
                                <span className="text-gray-400"> {timeSince(tweet.createdAt)} </span>
              </Link>
            </div>
            <p>{tweet.text}</p>
          </div>
        </div>

        {/* Media */}
        {tweet.image && (
            <div className="mt-4 w-full">
              <LazyLoadImage
                src={tweet.image}
                alt=""
                className="w-[80%] mx-auto h-auto rounded-lg"
              />
            </div>
          )}

        {/* Footer */}
        <div className="flex items-center justify-between   mt-5 text-xl text-gray-500">
          <div className="flex gap-x-1 group hover:text-blue-500  transition-all items-center ">
            <BiMessageRounded className=" cursor-pointer  rounded-full p-2 group-hover:bg-blue-500/10   text-4xl " />
            {/* <span className="text-sm">27</span> */}
          </div>
          <BiRepost className="hover:text-green-500 transition-all cursor-pointer   hover:bg-green-500/10 p-2 rounded-full text-4xl   " />
          <div className="flex gap-x-1 group hover:text-red-500  transition-all  group items-center">
            <BiHeart className="group-hover:bg-red-500/10  cursor-pointer text-4xl p-2 rounded-full " />
            {/* <span className="text-sm">27</span> */}
          </div>

          <div className="flex items-center gap-x-1  text-gray-500">
            <FaRegBookmark className="hover:text-blue-500    cursor-pointer  hover:bg-blue-500/10 text-4xl p-2 " />
            <MdOutlineIosShare className="hover:text-blue-500 font-bold  cursor-pointer    hover:bg-blue-500/10 text-4xl p-2 rounded-full" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TweetCardforuserTweet;
