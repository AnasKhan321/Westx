import React from "react";
import { timeSince } from "../utils/date";
import { Link } from "react-router-dom";


interface ReplyProps {
  name: string;
  username: string;
  date: Date;
  content: string;
  photoURL : string;
  createdAt : Date
  replyid : string
}

const Reply2: React.FC<ReplyProps> = ({ name, username, content  , photoURL  , createdAt , replyid}) => {
  return (
    <div className="border-l border-gray-700 ml-10 pl-4 py-2">
      <div className="flex items-start space-x-3">
        {/* Profile Picture */}
        <img
          src={photoURL}
          alt={name}
          width={40}
          height={40}
          className="rounded-full "
        />

        {/* Reply Content */}

        <div className="w-full">
          {/* Header */}
          <div className="flex items-center space-x-2">
            <span className="font-bold">{name}</span>
            <Link  to={`/user/${username}`}><span className="text-gray-500">@{username} · </span> </Link> 
            <span className="text-gray-500"> {timeSince(createdAt)} </span>
          </div>

          {/* Content */}
         <Link to={`/reply/${replyid}`}>  <p className="text-white mt-1">{content}</p> </Link>


        </div>
      </div>
    </div>
  );
};

export default Reply2;
