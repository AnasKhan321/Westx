import { Tweet } from "../utils/type";
import { Link } from "react-router-dom";
import { timeSince } from "../utils/date";
import { DynamicText } from "./DynamicText";
import { LazyLoadImage } from "react-lazy-load-image-component";
import SafeImage from "./SafeImage";
import { motion } from "motion/react";
const TweetCardBookmark = ({ tweet }: { tweet: Tweet }) => {
  return (
    <motion.div initial={{opacity : 0 , y:10  }} animate={{opacity : 1 , y:0  }} transition={{duration : 0.7}}>
    <div>
      <div className="  text-white w-full  md:w-[96%] grid grid-cols-18  mx-auto   p-4  border-b border-white/20   ">
        <div className=" col-span-3 tablet:col-span-3 md:col-span-2  xl:col-span-2  3xl:col-span-1">

          <SafeImage 
          src={tweet.user.photoURL}
          alt={tweet.user.name}
          width={48}
          height={48}
          className="rounded-full "
          />

        </div>
        <div className=" col-span-15  tablet:col-span-15 md:col-span-16 xl:col-span-16   3xl:col-span-17">
          <div className="flex items-center space-x-2 ">
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
                alt=""
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
    </motion.div>
  );
};

export default TweetCardBookmark;
