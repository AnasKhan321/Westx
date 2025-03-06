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

  const [isfollower, setisfollower] = useState(false);


  const { data: userfollowing, isLoading: userfollowingloading } = useQuery({
    queryKey: [`UserFollowing:${profile.username}`],

    queryFn: () => getUserFollowinguserid(profile.id),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const {handleTokenLaucnh}  = useToken() 

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
    if (user?.id) {
      setisfollower(true);
      const response = await followuser({
        followerid: user?.id as string,
        followingid: profile.id,
      });
      setisFollow(true);
      setuserfollower(suserfollower + 1);
      if (response?.success) {
        toast.success("follow successfully!");
        queryClient.invalidateQueries({
          queryKey: [`USER:FOLLOWERS:${profile.username}`],
        });
        queryClient.invalidateQueries({
          queryKey: [`USER:FOLLOWING:${profile.username}`],
        });
        queryClient.invalidateQueries({
          queryKey: [`UserFollower:${profile.username}`],
        });
        
        if (following) {
          setfollowings(following + 1);
        }
        setisfollower(false);
      } else if (response?.success == false) {
        toast.error("Something went wrong");
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
      toast.success("unfollow successfully!");
      queryClient.invalidateQueries({
        queryKey: [`USER:FOLLOWERS:${profile.username}`],
      });
      queryClient.invalidateQueries({
        queryKey: [`USER:FOLLOWING:${profile.username}`],
      });
      queryClient.invalidateQueries({
        queryKey: [`UserFollower:${profile.username}`],
      });
      if (following) {
        setfollowings(following - 1);
      }
      setisfollower(false);
    } else if (response?.success == false) {
      toast.error("Something went wrong");
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
              alt="Cover"
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

      <div className="grid grid-cols-18 pb-10 border-b border-white/40 w-[95%]  mx-auto ">
        <div className="relative flex flex-col  items-start col-span-16  md:col-span-8    -mt-12">
          <img
            src={profile.photoURL as string}
            alt="user"
            className=" w-20 h-20  md:w-24 md:h-24 rounded-full border  border-white"
          />
          <h2 className=" text-base  md:text-xl font-semibold mt-2">
            {profile.name}
          </h2>
          <p className="text-white/60 text-sm mt-2 ">
            @{profile.username}{" "}
            <span className="text-white/40">
              • Joined {formatDateTime(profile.createdAt)}
            </span>
          </p>

          <div className="flex justify-around gap-x-2 mt-5 w-[85%]  ">
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
                <div className="text-center flex gapx-x-1 w-full     items-center">
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
                <div className="text-center flex gapx-x-1 w-full     items-center">
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

          <div className="flex items-center space-x-4  mt-6  mb-2 ">
            {isFollow ? (
              <button
                onClick={handleUnfollow}
                className="py-2  px-6  bg-white text-black hover:bg-gradient-to-br  hover:text-white hover:bg-black transition-all border border-black hover:border-white  rounded-full "
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
                className="py-2  px-6  bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br   rounded-full "
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

            <Link
              to={`/chat/${profile.username}`}
              className="py-2  px-4  bg-black text-white border border-white hover:bg-white hover:text-black transition-all   rounded-full  "
            >
              Talk to Persona
            </Link>



          </div>
        </div>

        <div className=" col-span-18 md:col-span-10  mt-10 md:mt-0  flex flex-col  justify-center  ">

        {profile?.isToken &&(
            <TokenDetail publicKey={profile.publicKey as string} />
          )}

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
