import { Link } from "react-router-dom";
import {  Tweet } from "../utils/type";
import { timeSince } from "../utils/date";
import { LazyLoadImage } from "react-lazy-load-image-component";
export default function TweetDetailTweet({ tweet }: { tweet: Tweet }) {

  return (
    <div className=" text-white  py-4   w-[93%]   mx-auto  rounded-lg border-b border-borderColor ">
      {/* Header */}
      <div className="flex items-start space-x-3">
        <img
          src={tweet.user.photoURL}
          alt={tweet.user.name}
          width={48}
          height={48}
          className="rounded-full "
        />
        <div>
          <div className="flex items-center space-x-2">
            <span className=" text-sm md:text-base font-bold">{tweet.user.name}</span>
            <Link to={`/user/${tweet.user.username}`}>
              {" "}
              <span className=" text-sm  md:text-base text-gray-400">{tweet.user.username} · </span>
              <span className=" text-sm  md:text-base text-gray-500">
                {" "}
                {timeSince(tweet.createdAt)}{" "}
              </span>
            </Link>
          </div>
          <Link to={`/tweet/${tweet.id}`}>  
          <p className=" text-sm md:text-base">{tweet.text}</p>
          
          </Link>
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
    </div>
  );
}
