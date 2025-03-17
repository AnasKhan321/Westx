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
          <div key={tweet.id} className=" p-1 md:p-3 bg-secondaryColor rounded-lg flex items-start space-x-2 md:space-x-3">
          <SafeImage 
          src={tweet.user.photoURL}
          alt={tweet.user.name}
          width={48}
          height={48}
          className="rounded-full "
          />
            <div className="flex-1">
              <Link to={`/user/${tweet.user.username}`}> <div className="flex items-center space-x-2">
                <span className="font-semibold md:text-base text-sm">{tweet.user.name}</span>
                <span className="text-gray-400  md:text-base text-sm ">@{tweet.user.username}</span>
                {tweet.user.verified && <span className="text-blue-400">✔</span>}
              </div></Link>  
              <Link to={`/tweet/${tweet.id}`}> 
              <p className="text-gray-200 mt-1 text-xs md:text-sm">  {DynamicText({text : tweet.text as string , postedBy : "AI"})} </p></Link>
              <div className="text-gray-400 mt-2 md:text-sm text-xs ">❤️ {tweet.likes.length} Likes</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;
