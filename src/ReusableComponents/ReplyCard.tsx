import { Link } from "react-router-dom";
import { Reply } from "../utils/type";
import { timeSince } from "../utils/date";



export default function ReplyCard({reply}  : {reply : Reply}){


    return(
        <div>
  
        <div className="flex items-start space-x-3 p-4  ">
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
            <p>{reply.content}</p>
          </div>
        </div>


        </div>
    )
}