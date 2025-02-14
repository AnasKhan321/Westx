import toast from "react-hot-toast";
import { useAuth } from "../Context/AuthContext";
import { followuser, unfollowuser } from "../utils/creationcall";
import { formatDateTime } from "../utils/date";
import { User2 } from "../utils/type";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUserFollowerbyuserid,
  getUserFollowinguserid,
} from "../utils/apicalls";

import SmallLoader from "./SmallLoader";
import UserTweets from "./UsertTweets";
import axios from "axios";
import UserReposts from "./UserReposts";
import UserLikes from "./UserLikes";
import UserReplies from "./UserReplies";

interface Tweetcounts {
  success : boolean , 
  data : number
}

const GetTweetCount  = async(userid : string)=>{
  const {data}  = await axios.get<Tweetcounts>(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/tweetCount/${userid}`)
  return data ; 
}

const Profile: React.FC<{ profile: User2 }> = ({ profile }) => {
  const { user, handleLogout } = useAuth();
  const queryClient = useQueryClient() ; 
  const tabs = ["Posts", "Replies", "Likes", "Repost"];
  const [activeTab, setActiveTab] = useState("Posts");
 
  const { data: userfollowing, isLoading: userfollowingloading } = useQuery({
    queryKey: [`UserFollowing:${profile.username}`],

    queryFn: () => getUserFollowinguserid(profile.id),

  });



  const { data: userfollower, isLoading: userfollowerloading } = useQuery({
    queryKey: [`UserFollower:${profile.username}`],

    queryFn: () => getUserFollowerbyuserid(profile.id),
  });


  const {data : usertweetscount , isLoading : usertweetloading }  = useQuery({
    queryKey : [`tweetCount:${profile.username}`] , 
    queryFn : ()=> GetTweetCount(profile.id)
  })

  const [suserfollowing, setuserfollowing] = useState(0);
  const [suserfollower, setuserfollower] = useState(0);

  const [following, setfollowings] = useState(userfollowing?.data.length);
  const [isFollow, setisFollow] = useState(
    userfollower?.data.some((follower) => follower.followingid == user?.id)
  );

  useEffect(() => {
    setfollowings(userfollowing?.data.length)
    setisFollow(
      userfollowing?.data.some((follower) => follower.followerid == user?.id)
    );
  }, [userfollowing?.data]);

  useEffect(()=>{
    setfollowings(userfollower?.data.length)
  },[userfollower?.data])

  const handleFollow = async () => {
    if (user?.id) {
      setisFollow(true);
      const response = await followuser({
        followerid: user?.id as string,
        followingid: profile.id,
      });
      setuserfollower(suserfollower + 1);
      if (response?.success) {
        toast.success("follow successfully!");
        queryClient.invalidateQueries({ queryKey: [`UserFollowing:${profile.username}`] });

        queryClient.invalidateQueries({ queryKey: [`UserFollower:${user?.username}`]});
        queryClient.invalidateQueries({ queryKey: [`UserFollowing:${user?.username}`]});

        if (following) {
          setfollowings(following + 1);
        }
      }else if(response?.success == false){
        toast.error("Something went wrong")
      }
    }
  };

  const handleUnfollow = async () => {
    setisFollow(false);
    const response = await unfollowuser({
      followerid: user?.id as string,
      followingid: profile.id,
    });
    setuserfollower(suserfollower - 1);
    if (response?.success) {
      toast.success("unfollow successfully!");
      queryClient.invalidateQueries({ queryKey: [`UserFollowing:${profile.username}`] });
      queryClient.invalidateQueries({ queryKey: [`UserFollower:${user?.username}`]});
      queryClient.invalidateQueries({ queryKey: [`UserFollowing:${user?.username}`]});

      if (following) {
        setfollowings(following - 1);
      }
    }else if(response?.success == false){
      toast.error("Something went wrong")
    }
  };

  const handleLogoutfn = () => {
    handleLogout();
    toast.success("Logout Successfully !")
  };

  useEffect(() => {
    if (userfollower?.data) {
      setuserfollowing(userfollower.data.length);
    }
  }, [userfollower?.data]);

  useEffect(() => {
    if (userfollowing?.data) {
      setuserfollower(userfollowing.data.length);
    }
  }, [userfollowing?.data]);
  return (
    <div className={`w-full  rounded-lg  shadow-md `}>
      {/* Cover Photo */}
      <div
        className="h-40 bg-cover bg-center"
        style={{ backgroundImage: `url(${profile?.coverPhotoURL})` }}
      ></div>

      {/* Profile Info */}
      <div className="p-4 text-center relative">
        {/* Profile Picture */}
        <img
          src={profile.photoURL}
          alt={`${profile.name} profile`}
          className="w-24 h-24 mx-auto rounded-full border-4"
          style={{ borderColor: profile.accent || "purple" }}
        />
        {user?.username == profile.username && (
          <button
            onClick={handleLogoutfn}
            className="absolute top-3 right-3 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-full shadow-md hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        )}

{user?.username === profile.username && !profile.isPremium && (
  <button
    className="absolute top-3 right-[100px] px-4 py-2 bg-yellow-500 text-white text-sm font-semibold rounded-full shadow-md hover:bg-yellow-600 transition duration-200"
  >
    Upgrade
  </button>
)}

        {/* Name and Username */}
        <h2 className="text-xl font-bold mt-2">{profile.name}</h2>
        <p className="text-sm text-gray-500">
          @{profile.username}{" "}
          {profile.verified && <span className="text-blue-500 ml-1">✔</span>}
        </p>
        <p className="text-sm mt-2">{profile.location}</p>
        <p className="text-xs text-gray-400">
          Joined {formatDateTime(profile.createdAt)}
        </p>
        {/* Follow Button */}

{!userfollowingloading  && <div> 
  
  {user?.username !== profile.username && (
          <>
            {isFollow ? (
              <button
                onClick={handleUnfollow}
                className="mt-4 px-4 py-2 text-black bg-white   text-sm  text-center me-2 mb-2 font-medium rounded-full shadow  transition duration-200"
              >
                unfollow
              </button>
            ) : (
              <button
                onClick={handleFollow}
                className="mt-4 px-4 py-2 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800  text-sm  text-center me-2 mb-2 font-medium rounded-full shadow  transition duration-200"
              >
                Follow
              </button>
            )}
          </>
        )}
  </div>}

      </div>

      {/* Stats */}
      <div className="flex justify-around border-y py-2 text-center border-borderColor">
        {userfollowingloading && <SmallLoader />}
        {userfollowing?.success && (
          <div>
            <p className="font-bold">{suserfollowing}</p>
            <Link to={`/following/${profile.id}`}> <p className="text-xs text-gray-500">Following</p> </Link>  
          </div>
        )}

        {userfollowerloading && <SmallLoader />}

        {userfollower?.success && (
          <div>
            <p className="font-bold">{suserfollower}</p>
        <Link to={`/follower/${profile.id}`}>       <p className="text-xs text-gray-500">Followers</p>  </Link> 
          </div>
        )}
        <div>
        {usertweetloading && <SmallLoader />}
          {usertweetscount?.success && (
            <div>
              <p className="font-bold">{usertweetscount.data}</p>
              <p className="text-xs text-gray-500">Tweets</p>
            </div>
          )}
        </div>
      </div>

      {user?.username !== profile.username && (
        <>
          {profile.username !== "ANASKHA96399553" && (
            <div className="flex items-center justify-center p-6 bg-black border-b border-borderColor">
              <Link
                to={`/chat/${profile.username}`}
                className="px-6 py-2 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800  text-sm  text-center me-2 mb-2 font-medium rounded-full shadow  transition duration-200"
              >
                Talk to {profile.name}
              </Link>
            </div>
          )}
        </>
      )}

      <div className="mt-5">


      <div className="w-full  mx-auto mt-5">
      <div className="flex border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-2 text-center text-white ${
              activeTab === tab ? "border-b-2 border-purple-500 font-semibold" : "text-gray-400"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className=" text-white">
        
          {activeTab == "Posts"  && <> 
        <UserTweets userId={profile.id}/>
          
          </>}


          {activeTab == "Replies"  && <> 
            <UserReplies user={profile}/>
          
          </>}


          {activeTab == "Likes"  && <> 
             <UserLikes id={profile.id}/>
          
          </>}


          {activeTab == "Repost"  && <> 
        <UserReposts id={profile.id}/> 
          
          </>}


      </div>
    </div>




      </div>
    </div>
  );
};

export default Profile;
