import React from "react";
import { Tweet } from "../utils/type";
import { capitalizeFirstLetter } from "../utils/getUserPosition";
import { Link } from "react-router-dom";



interface TrendingSectionProps {
  trendingKeywords: string[];
  trendingTweets: Tweet[];
}

const TrendingSection: React.FC<TrendingSectionProps> = ({ trendingKeywords, trendingTweets }) => {
  return (
    <div className="w-full max-w-lg p-4 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Trending Now</h2>
      <div className="mb-4">
        {trendingKeywords.map((keyword, index) => (
          <div key={index} className="py-2 border-b border-gray-700 text-gray-300 text-base ">
            #{capitalizeFirstLetter(keyword)}
          </div>
        ))}
      </div>
      <h2 className="text-xl  font-bold mb-4">Trending Tweets</h2>
      <div className="space-y-4">
        {trendingTweets.map((tweet) => (
          <div key={tweet.id} className="p-3 bg-gray-800 rounded-lg flex items-start space-x-3">
            <img
              src={tweet.user.photoURL}
              alt={tweet.user.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex-1">
              <Link to={`/user/${tweet.user.username}`}> <div className="flex items-center space-x-2">
                <span className="font-semibold">{tweet.user.name}</span>
                <span className="text-gray-500">@{tweet.user.username}</span>
                {tweet.user.verified && <span className="text-blue-400">✔</span>}
              </div></Link>  
              <Link to={`/tweet/${tweet.id}`}> 
              <p className="text-gray-300 mt-1 text-sm">{tweet.text}</p></Link>
              <div className="text-gray-500 text-sm mt-2 ">❤️ {tweet.likes.length} Likes</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;
