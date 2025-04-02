import toast from "react-hot-toast";
import { useAuth } from "../Context/AuthContext";
import { followuser, unfollowuser } from "../utils/creationcall";
import { formatDateTime } from "../utils/date";
import { User2 } from "../utils/type";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { ColorRing } from "react-loader-spinner";
import { IoCaretBack } from "react-icons/io5";
import TokenDetail from "./TokenDetail";
import { useToken } from "../Context/TokenContext";
import SafeImage from "./SafeImage";

interface Tweetcounts {
  success: boolean;
  data: number;
}

const GetTweetCount = async (userid: string) => {
  const { data } = await axios.get<Tweetcounts>(
    `${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/tweetCount/${userid}`
  );
  return data;
};

const Profile: React.FC<{ profile: User2 }> = ({ profile }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const tabs = ["Posts", "Replies", "Likes", "Repost"];
  const [activeTab, setActiveTab] = useState("Posts");
  const {isAuthenticated} = useAuth()

  const [isfollower, setisfollower] = useState(false);


  const { data: userfollowing, isLoading: userfollowingloading } = useQuery({
    queryKey: [`UserFollowing:${profile.username}`],
    queryFn: () => getUserFollowinguserid(profile.id),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { handleTokenLaucnh } = useToken()

  const { data: userfollower, isLoading: userfollowerloading } = useQuery({
    queryKey: [`UserFollower:${profile.username}`],
    queryFn: () => getUserFollowerbyuserid(profile.id),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: usertweetscount, isLoading: usertweetloading } = useQuery({
    queryKey: [`tweetCount:${profile.username}`],
    queryFn: () => GetTweetCount(profile.id),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const [suserfollowing, setuserfollowing] = useState(0);
  const [suserfollower, setuserfollower] = useState(0);

  const [following, setfollowings] = useState(userfollowing?.data.length);
  const [isFollow, setisFollow] = useState(
    userfollower?.data.some((follower) => follower.followingid == user?.id)
  );

  useEffect(() => {
    setfollowings(userfollowing?.data.length);
    setisFollow(
      userfollowing?.data.some((follower) => follower.followerid == user?.id)
    );
  }, [userfollowing?.data]);

  useEffect(() => {
    setfollowings(userfollower?.data.length);
  }, [userfollower?.data]);

  const handleFollow = async () => {
    if (isfollower) {
      return;
    }

    if(!isAuthenticated){
      toast.error("Please login to follow", {
        style: {
          borderRadius: '20px',
          background: '#333',
          color: '#fff',
        },
      });
    }
    if (user?.id) {
      setisfollower(true);
      const response = await followuser({
        followerid: user?.id as string,
        followingid: profile.id,
      });
      setisFollow(true);
      setuserfollower(suserfollower + 1);
      if (response?.success) {
        toast.success("follow successfully!", {
          style: {
            borderRadius: '20px',
            background: '#333',
            color: '#fff',
          },

        });
        queryClient.invalidateQueries({ queryKey: [`UserFollower:${profile.username}`], });
        queryClient.invalidateQueries({ queryKey: [`UserFollowing:${profile.username}`], });
        queryClient.invalidateQueries({ queryKey: [`USER:FOLLOWERS:${profile.username}`], });
        queryClient.invalidateQueries({ queryKey: [`USER:FOLLOWING:${profile.username}`], });

        if (following) {
          setfollowings(following + 1);
        }
        setisfollower(false);
      } else if (response?.success == false) {
        toast.error("Something went wrong", {
          style: {
            borderRadius: '20px',
            background: '#333',
            color: '#fff',
          },

        });
      }
    }
  };

  const handleUnfollow = async () => {
    if (isfollower) {
      return;
    }

    setisfollower(true);
    const response = await unfollowuser({
      followerid: user?.id as string,
      followingid: profile.id,
    });
    setisFollow(false);
    setuserfollower(suserfollower - 1);
    if (response?.success) {
      toast.success("unfollow successfully!", {
        style: {
          borderRadius: '20px',
          background: '#333',
          color: '#fff',
        },

      });
      queryClient.invalidateQueries({ queryKey: [`UserFollower:${profile.username}`], });
      queryClient.invalidateQueries({ queryKey: [`UserFollowing:${profile.username}`], });
      queryClient.invalidateQueries({ queryKey: [`USER:FOLLOWERS:${profile.username}`], });
      queryClient.invalidateQueries({ queryKey: [`USER:FOLLOWING:${profile.username}`], });
      if (following) {
        setfollowings(following - 1);
      }
      setisfollower(false);
    } else if (response?.success == false) {
      toast.error("Something went wrong", {
        style: {
          borderRadius: '20px',
          background: '#333',
          color: '#fff',
        },

      });
    }
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

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };
  return (
    <div className="w-ful border border-white/10 h-screen   md:min-h-[96vh]  overflow-y-scroll  md:max-h-[96vh]  md:my-[2vh]  mx-auto bg-primaryColor md:bg-secondaryColor text-white  md:rounded-xl overflow-hidden  ">
      <div className="">
        <div className="relative">
          <div className="relative w-full h-48">
            <img
              src={profile.coverPhotoURL || "/back.jpeg"}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null; // Prevent infinite loop
                target.src = "/back.jpeg";
              }}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-[#000000b1] mix-blend-multiply"></div>
          </div>
          <div className="absolute flex items-center  space-x-2 top-4 left-4 text-white text-lg font-semibold">
            <IoCaretBack className="cursor-pointer" onClick={handleClick} />
            <span>{profile.name}</span>
          </div>

          <div className="absolute top-4 right-4 flex space-x-2">
            {(!profile.isToken && user?.username === import.meta.env.VITE_PUBLIC_ADMIN_USERNAME) &&
              <button onClick={() => handleTokenLaucnh(profile.name, profile.photoURL, profile.username)} className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br px-4 py-1 rounded-full border border-white">
                Upgrade
              </button>}

          </div>
        </div>
      </div>

      <div className="grid grid-cols-18 pb-0 md:pb-10 border-b border-white/40 w-[95%]  mx-auto ">
        <div className="relative flex flex-col  items-start col-span-18  md:col-span-18    -mt-12">

          <SafeImage
            src={profile.photoURL as string}
            alt="user"
            className=" w-20 h-20  md:w-24 md:h-24 rounded-full border  border-white"
          />


          <div className=" flex items-center  gap-x-4 mt-4 ">
            <h2 className=" text-base  md:text-xl font-semibold ">

              {profile.name}
            </h2>

            <div className="flex items-center space-x-4    ">
              {isFollow ? (
                <button
                  onClick={handleUnfollow}
                  className=" text-white/60 "
                >
                  {isfollower ? (
                    <ColorRing
                      visible={true}
                      height="20"
                      width="20"
                      ariaLabel="color-ring-loading"
                      wrapperStyle={{}}
                      wrapperClass="color-ring-wrapper"
                      colors={[
                        "#9915eb",
                        "#9915eb",
                        "#9915eb",
                        "#9915eb",
                        "#9915eb",
                      ]}
                    />
                  ) : (
                    "unFollow"
                  )}
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  className=" text-purple-400 "
                >
                  {isfollower ? (
                    <ColorRing
                      visible={true}
                      height="20"
                      width="20"
                      ariaLabel="color-ring-loading"
                      wrapperStyle={{}}
                      wrapperClass="color-ring-wrapper"
                      colors={[
                        "#FFFFFF",
                        "#FFFFFF",
                        "#FFFFFF",
                        "#FFFFFF",
                        "#FFFFFF",
                      ]}
                    />
                  ) : (
                    "Follow"
                  )}
                </button>
              )}




            </div>



            <Link
              to={`/chat/${profile.username}`}
              className="   text-white  text-sm     underline  "
            >
              Talk to Persona
            </Link>

          </div>
          <p className="text-white/60 text-sm mt-1 ">
            @{profile.username}{" "}
            <span className="text-white/40">
              • Joined {formatDateTime(profile.createdAt)}
            </span>
          </p>

          <div className="flex justify-around gap-x-2 mt-4  w-full md:w-[35%]  ">
            <div className="text-center flex gapx-x-1 w-full   items-center">
              {userfollowingloading ? (
                <SmallLoader />
              ) : (
                <p className="text-base font-semibold mx-1 ">
                  {suserfollowing}
                </p>
              )}
              <Link to={`/following/${profile.id}`}>
                {" "}
                <p className="text-white/60 text-sm ">Following</p>
              </Link>

            </div>
            <div className="text-center flex gapx-x-1 w-full   items-center">
              {userfollowerloading ? (
                <SmallLoader />
              ) : (
                <p className="text-base font-semibold mx-1 ">
                  {userfollowing?.data?.length}
                </p>
              )}
              <Link to={`/follower/${profile.id}`}>
                {" "}
                <p className="text-white/60 text-sm ">Followers</p>
              </Link>

            </div>
            <div className="text-center flex gapx-x-1 w w-full       items-center">
              {usertweetloading ? (
                <SmallLoader />
              ) : (
                <p className="text-base font-semibold mx-1 ">
                  {usertweetscount?.data}
                </p>
              )}
              <p className="text-white/60 text-sm ">Tweets</p>

            </div>
          </div>

          <p className="ml-1 text-white/80 text-sm md:text-base mt-4 leading-relaxed whitespace-pre-wrap">
                {profile.bio || "No bio yet"}
              </p>

          {profile?.isToken && (
            <TokenDetail publicKey={profile.publicKey as string} />
          )}
        </div>

        <div className=" col-span-18 md:col-span-10  mt-10 md:mt-0  flex flex-col  justify-center  ">


        </div>



      </div>



      <div className="     w-[95%]  mx-auto  mt-4">
        <div className=" w-full  md:w-[50%] flex justify-between   ">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={` ${activeTab === tab
                ? " text-white font-bold border-purple-600 border-b-4 transition-all  "
                : " py-2 text-white/60 hover:text-white   transition-all"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className=" text-white">
        {activeTab == "Posts" && (
          <>
            <UserTweets userId={profile.id} />
          </>
        )}

        {activeTab == "Replies" && (
          <>
            <UserReplies user={profile} />
          </>
        )}

        {activeTab == "Likes" && (
          <>
            <UserLikes id={profile.id} />
          </>
        )}

        {activeTab == "Repost" && (
          <>
            <UserReposts id={profile.id} />
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
