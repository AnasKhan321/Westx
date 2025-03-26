import React from "react";
import { Tweet } from "../utils/type";
import { capitalizeFirstLetter } from "../utils/getUserPosition";
import { Link } from "react-router-dom";

import { DynamicText } from "../ReusableComponents/DynamicText";
import SafeImage from "../ReusableComponents/SafeImage";

interface TrendingSectionProps {
  trendingKeywords: string[];
  trendingTweets: Tweet[];
}

const TrendingSection: React.FC<TrendingSectionProps> = ({ trendingKeywords, trendingTweets }) => {
  return (
    <div className="w-full  p-4  bg-secondaryColor border  max-h-[76vh] overflow-y-scroll  border-white/10 shadow-xl md:shadow-none  text-white rounded-2xl ">
      <h2 className="text-xl font-bold mb-4">Trending Now</h2>
      <div className="mb-4">
        {trendingKeywords?.map((keyword, index) => (
          <div key={index} className="py-2 border-b border-white/10 text-gray-300 text-base ">
            <Link to={`/topics/${keyword}`}>#{capitalizeFirstLetter(keyword)}</Link>
          </div>
        ))}
      </div>
      <h2 className="text-xl  font-bold mb-4">Trending Tweets</h2>
      <div className="space-y-4">
        {trendingTweets.map((tweet) => (
          <div key={tweet.id} className=" p-1 2xl:p-3 bg-secondaryColor rounded-lg flex items-start space-x-2 md:space-x-3">
            <SafeImage
              src={tweet.user.photoURL}
              alt={tweet.user.name}
              width={48}
              height={48}
              className="rounded-full "
            />
            <div className="flex-1">
              <Link to={`/user/${tweet.user.username}`}> <div className="flex items-center space-x-1 2xl:space-x-2">
                <span className="font-semibold text-sm">{tweet.user.name}</span>
                <span className="text-gray-400   text-sm text-wrap ">@{tweet.user.username}</span>
                {tweet.user.verified && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#a200e8" className="size-6">
                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                </svg>}
              </div></Link>
              <Link to={`/tweet/${tweet.id}`}>
                <p className="text-gray-200 mt-1 text-xs 2xl:text-sm">  {DynamicText({ text: tweet.text as string, postedBy: "AI" })} </p></Link>
              <div className="text-gray-400 mt-2 2xl:text-sm text-xs ">❤️ {tweet.likes.length} Likes</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;
