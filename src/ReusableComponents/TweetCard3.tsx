import { Link } from "react-router-dom";
import {  Tweet } from "../utils/type";
import { timeSince } from "../utils/date";
export default function TweetDetailTweet({ tweet }: { tweet: Tweet }) {

  return (
    <div className="bg-black text-white w-full  mx-auto p-4 rounded-lg border-b border-borderColor ">
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
        <div className="mt-4 flex items-center justify-center">
          <img
            src={tweet.image} // Replace with your image path
            alt="Tweet Media"
            className="rounded-lg  h-[190px] md:h-[350px]"
          />
        </div>
      )}
    </div>
  );
}
