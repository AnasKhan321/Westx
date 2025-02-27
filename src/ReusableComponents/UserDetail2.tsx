import React from "react";
import { User } from "../utils/type";
import TweetCardforuserTweet from "./TweetCard2";
import { useAuth } from "../Context/AuthContext";
import {    formatDateTime} from "../utils/date";


const Profile2: React.FC<{ profile: User }> = ({ profile }) => {
  const {user}  = useAuth() ; 

  const handleLogout = () => {
    // Logout logic (customize based on your auth setup)

  };

  return (
    <div
      className="w-full max-w-2xl mx-auto mt-10 bg-black rounded-lg shadow-lg overflow-hidden border border-borderColor"
    >
      <div
        className="h-48 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${profile.coverPhotoURL})` }}
      >

        {user?.username == profile.username && 
        <button
          onClick={handleLogout}
          className="absolute top-3 right-3 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-full shadow-md hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>}
      </div>

      <div className="p-6 text-center">
   
        <img
          src={profile.photoURL}
          alt={`${profile.name} profile`}
          className="w-28 h-28 mx-auto rounded-full border-4 mb-4"
          style={{ borderColor: profile.accent || "purple" }}
        />

        <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
        <p className="text-sm text-gray-500">
          @{profile.username}{" "}
          {profile.verified && (
            <span className="text-blue-500 ml-1">✔</span>
          )}
        </p>
        <p className="text-sm mt-2">{profile.location}</p>
        <p className="text-xs text-gray-400">
          Joined{formatDateTime(profile.createdAt)}

        </p>
   

      </div>


      <div className="flex justify-around border-y py-4 text-center border-borderColor bg-black ">
        <div>
          <p className="font-bold">{profile.followings.length}</p>
          <p className="text-xs text-gray-500">Following</p>
        </div>
        <div>
          <p className="font-bold">{profile.followers.length}</p>
          <p className="text-xs text-gray-500">Followers</p>
        </div>
        <div>
          <p className="font-bold">{profile.totalTweets}</p>
          <p className="text-xs text-gray-500">Tweets</p>
        </div>
      </div>

      {/* Chat Bot */}
      <div className="flex items-center justify-center p-6 bg-black border-b border-borderColor">
        <img
          src="https://via.placeholder.com/50" // Replace with a bot image URL
          alt="Chat Bot"
          className="w-16 h-16 rounded-full bg-black mr-4"
        />
        <button
          className="px-6 py-2 bg-blue-500 text-white font-medium rounded-full shadow hover:bg-blue-600 transition duration-200"
          onClick={() => {
     
          }}
        >
          Talk to {profile.name}
        </button>
      </div>



      <div className="p-6 space-y-4">
        {profile.tweets &&
          profile.tweets.map((tweet  , index ) => {
            return <TweetCardforuserTweet key={index} tweet={tweet} user={profile} />;
          })}
      </div>
    </div>
  );
};

export default Profile2;
