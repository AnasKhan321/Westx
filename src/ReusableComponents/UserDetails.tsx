import toast, { useToaster } from "react-hot-toast";
import { useAuth } from "../Context/AuthContext";
import { followuser  , unfollowuser } from "../utils/creationcall";
import { formatDateTime } from "../utils/date";
import { User2 } from "../utils/type";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTweetbyuserid, getUserFollowerbyuserid, getUserFollowinguserid } from "../utils/apicalls";
import TweetCardv2 from "./TweetCardv2";
import SmallLoader from "./SmallLoader";

const Profile: React.FC<{ profile: User2 }> = ({ profile }) => {
  const { user  , handleLogout } = useAuth();

  

  const {data : usertweets , isLoading : userloding}  = useQuery({queryKey :  [`UserTweets:${profile.username}`] 
     , queryFn : ()=> getTweetbyuserid(profile.id)
  })

  const {data : userfollowing , isLoading : userfollowingloading  }  = useQuery({queryKey : [`UserFollowing:${profile.username}`]  , 

    queryFn : ()=> getUserFollowinguserid(profile.id)
  })


  const {data : userfollower , isLoading : userfollowerloading }  = useQuery({queryKey : [`UserFollower:${profile.username}`]  , 

    queryFn : ()=> getUserFollowerbyuserid(profile.id)
  })


  const [suserfollowing , setuserfollowing]  = useState(0)  ; 
  const [suserfollower , setuserfollower]  = useState(0)  ; 

  const [following , setfollowings]  = useState(userfollowing?.data.length)
  const [isFollow, setisFollow] = useState(
   user?.followers.some((follower)=> follower.followingid == profile.id)
  );

  const handleFollow = async () => {
    if(user?.id){
      setisFollow(true)
      const response = await followuser({
        followerid: user?.id as string,
        followingid: profile.id,
      });
      setuserfollower(suserfollower+1)
      if (response?.success) {
        toast.success("follow successfully!");
        
        if(following){
          setfollowings(following+1)

        }
      }
    }
  };

  const handleUnfollow = async()=>{
    setisFollow(false)
      const response = await unfollowuser({followerid : user?.id as string , followingid : profile.id})
      setuserfollower(suserfollower-1)
      if (response?.success) {
        toast.success("unfollow successfully!");
 
        if(following){
          setfollowings(following-1)

        }
      }
  }

  const handleLogoutfn = () => {
    // Logout logic (customize based on your auth setup)
    handleLogout() ; 
  };


  useEffect(()=>{

    if(userfollower?.data){
      setuserfollowing(userfollower.data.length)
    }
  },[userfollower?.data])



  
  useEffect(()=>{

    if(userfollowing?.data){
      setuserfollower(userfollowing.data.length)
    }
  },[userfollowing?.data])
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
        {user?.username == profile.username && 
        <button
          onClick={handleLogoutfn}
          className="absolute top-3 right-3 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-full shadow-md hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>}
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
      </div>

      {/* Stats */}
      <div className="flex justify-around border-y py-2 text-center border-borderColor">

        {userfollowingloading  && <SmallLoader/>}
        {userfollowing?.success && 
        <div>
          <p className="font-bold">{suserfollowing}</p>
          <p className="text-xs text-gray-500">Following</p>
        </div>}

        {userfollowerloading  && <SmallLoader/>}

        {userfollower?.success && 
        <div>
          <p className="font-bold">{suserfollower}</p>
          <p className="text-xs text-gray-500">Followers</p>
        </div>}
        <div>

        { userloding && <SmallLoader/>}
          {usertweets?.success   && <div>
            <p className="font-bold">{usertweets?.data.length}</p>
            <p className="text-xs text-gray-500">Tweets</p>
          </div> }
     
        </div>
      </div>

      {user?.username !== profile.username && (

        <>
        
        
        
          {profile.username !== "ANASKHA96399553"   && 
               <div className="flex items-center justify-center p-6 bg-black border-b border-borderColor">


               {/* <img
                 src="https://via.placeholder.com/50" // Replace with a bot image URL
                 alt="Chat Bot"
                 className="w-16 h-16 rounded-full bg-black mr-4"
               /> */}
               <Link to={`/chat/${profile.username}`}
                 className="px-6 py-2 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800  text-sm  text-center me-2 mb-2 font-medium rounded-full shadow  transition duration-200"
     
               >
                 Talk to {profile.name}
               </Link>
             </div>
          
          }
        
        
        
        
        
        </>
   
      )}

      <div className="mt-5">

         {userloding && <div className="mt-10  text-center flex justify-center items-center w-full">
          <SmallLoader/> 
         </div>} 
        {usertweets?.success &&
          usertweets.data.map((tweet  , index ) => {
            return (
              <TweetCardv2 tweet={tweet}  key={index} />
            );
          })}
      </div>
    </div>
  );
};

export default Profile;
