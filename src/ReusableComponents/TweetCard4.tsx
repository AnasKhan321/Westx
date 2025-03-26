import React from "react";
import { timeSince } from "../utils/date";
import { Link } from "react-router-dom";
import { DynamicText } from "./DynamicText";
interface TweetProps {
  name: string;
  username: string;
  date: string;
  content: string;
  photoURL : string
  createdAt : Date | null
  tweetid : string

}

const Tweet4: React.FC<TweetProps> = ({ name, username, date, content, photoURL  , createdAt  , tweetid }) => {
  return (
    <div className=" p-4">
      <div className="flex items-start space-x-3">
        {/* Profile Picture */}
        <img
          src={photoURL}
          alt={name}
          width={48}
          height={48}
          className="rounded-full "
          onError={(e) => {
            e.currentTarget.src = "/userdefault.jpg";
          }}

        />

        {/* Tweet Content */}
        <div className="w-full">
          {/* Header */}
          <Link to={`/user/${username}`}> 
          <div className="flex items-center space-x-2">
            <span className=" text-sm   md:text-base  font-bold">{name}</span>
            <span className=" text-sm md:text-base text-gray-500">@{username} · {date}</span>
                          <span className="text-gray-400">
                            {" "}
                            {createdAt && <div className="text-gray-500"> {timeSince(createdAt)} </div> }

                          </span>
          </div></Link>

          {/* Content */}
          <Link to={`/tweet/${tweetid}`}> 
          <p className="text-sm   md:text-base text-white mt-1">
            <DynamicText text={content}/> 

          </p>
          </Link>


        </div>
      </div>
    </div>
  );
};

export default Tweet4;
