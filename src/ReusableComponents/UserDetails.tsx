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
import { IoChatboxOutline } from "react-icons/io5";
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
import UpdateUserModal from "./UpdateUserModel";

import Level4 from "./Level4";

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
  const { isAuthenticated } = useAuth()

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
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {

    setisFollow(
      userfollowing?.data.some((follower) => follower.followerid == user?.id)
    );
    setfollowings(userfollowing?.data.length);

  }, [userfollowing?.data]);

  useEffect(() => {
    setfollowings(userfollower?.data.length);
  }, [userfollower?.data]);

  const handleFollow = async () => {
    if (isfollower) {
      return;
    }

    if (!isAuthenticated) {
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




  const uploadinfile = async (file: File | undefined, profileKey: string): Promise<string | null> => {

    if (file) {
      const url = await axios.post(`${import.meta.env.VITE_PUBLIC_AI_URL}/GetSignedUrl`, {
        imageName: file?.name,
        imageType: file?.type,
        profileKey: profileKey
      });
      await axios.put(url.data.url, file);
      let uploadedurl = new URL(url.data.url);
      let uploadedurl2 = `${uploadedurl.origin}${uploadedurl.pathname}`;
      return uploadedurl2;
    } else {
      return null;
    }

  }

  const handleUpdate = async (data: {
    name?: string;
    profilePhoto?: File;
    coverPhoto?: File;
    bio?: string;
  }) => {
    setIsUpdating(true);

    const profilePhotoUrl = await uploadinfile(data.profilePhoto, "ProfilePhoto");
    const coverPhotoUrl = await uploadinfile(data.coverPhoto, "CoverPhoto");


    let updatedata = {
      name: data.name ? data.name : profile.name,
      profilephoto: profilePhotoUrl ? profilePhotoUrl : profile.photoURL,
      coverPhoto: coverPhotoUrl ? coverPhotoUrl : profile.coverPhotoURL,
      username: profile.username,
      bio: data.bio ? data.bio : profile.bio
    }
    const updateUser = await axios.post(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/update/userdata`, updatedata);

    if (updateUser.data.success) {
      toast.success("Profile updated successfully");

    } else {
      toast.error("Profile update failed");
    }
    setIsUpdating(false);
     setIsEditProfile(false);

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
    <div className="w-full border border-white/10 h-screen   tablet:min-h-[98vh]  overflow-y-scroll  tablet:max-h-[98vh]  tablet:mt-[2vh]  mx-auto bg-primaryColor md:bg-secondaryColor text-white  tablet:rounded-l-xl overflow-hidden  ">
      <UpdateUserModal isUpdating={isUpdating} initialData={{ name: profile.name, profilePhotoUrl: profile.photoURL as string, coverPhotoUrl: profile.coverPhotoURL as string, bio: profile.bio }} isOpen={isEditProfile} onClose={() => setIsEditProfile(false)} onUpdate={handleUpdate} />

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
            <span className="whitespace-nowrap overflow-hidden text-ellipsis  ">{profile.name}</span>
          </div>

          <div className="absolute top-4 right-4 flex space-x-2">
            {profile.creator === user?.username &&


              <>
                {parseInt(profile.level.toString().split("_")[1]) >= 2 &&
                  <button onClick={() => setIsEditProfile(!isEditProfile)} className=" border-white text-xs px-1 ss:text-sm md:text-base ss:px-2  md:px-4 py-1 rounded-full border hover:bg-white hover:text-black transition-all hover:border-black">Edit Profile</button>
                }



              </>
            }
            {(!profile.isToken && user?.username === import.meta.env.VITE_PUBLIC_ADMIN_USERNAME) &&
              <button onClick={() => handleTokenLaucnh(profile.name, profile.photoURL, profile.username, null)} className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br px-4 py-1 rounded-full border border-white">
                Upgrade
              </button>}

          </div>
        </div>
      </div>

      <div className="grid grid-cols-18 pb-0 md:pb-10 w-[95%]  mx-auto ">
        <div className="relative flex flex-col  items-start col-span-18  md:col-span-18    -mt-12">

          <SafeImage
            src={profile.photoURL as string}
            alt="user"
            className=" w-20 h-20  md:w-24 md:h-24 rounded-full border  border-white"
          />


          <div className=" flex items-center  gap-x-4 mt-4 ">
            <h2 className="text-base md:text-xl font-semibold whitespace-nowrap overflow-hidden text-ellipsis  ">
              {profile.name}
            </h2>

            {profile.isVerified && <div className="">

              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#a200e8" className="size-6">
                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
              </svg>

            </div>}
            <Link to={`/level-explain`} className="flex items-center relative group">
              <div className={`px-2 py-1 rounded-full text-xs font-semibold ${profile.level.toString() === 'LEVEL_0' ? 'bg-gray-500 text-white cursor-pointer hover:bg-gray-600' :
                  profile.level.toString() === 'LEVEL_1' ? 'bg-green-500 text-white cursor-pointer hover:bg-green-600' :
                    profile.level.toString() === 'LEVEL_2' ? 'bg-blue-500 text-white cursor-pointer hover:bg-blue-600' :
                      profile.level.toString() === 'LEVEL_3' ? 'bg-purple-500 text-white cursor-pointer hover:bg-purple-600' :
                        profile.level.toString() === 'LEVEL_4' ? 'bg-yellow-500 text-black cursor-pointer hover:bg-yellow-600' :
                          profile.level.toString() === 'LEVEL_5' ? 'bg-orange-500 text-white cursor-pointer hover:bg-orange-600' :
                            'bg-red-500 text-white cursor-pointer hover:bg-red-600'
                }`}>
                {profile.level.toString().split('_')[1]}
              </div>
              <div className="absolute font-roboto hidden group-hover:block bg-black/90 text-white text-xs rounded px-2 py-1 top-1/2 -translate-y-1/2 left-full ml-2 whitespace-nowrap">
                Persona's Level
              </div>
            </Link>

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
                    "Following"
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
              className="  hidden md:block text-white  text-sm  whitespace-nowrap overflow-hidden text-ellipsis   underline  "
            >
              Talk to Persona
            </Link>

            <Link
              to={`/chat/${profile.username}`}
              className="  block  p-3 rounded-full bg-secondaryColor md:hidden  text-white  text-sm  whitespace-nowrap overflow-hidden text-ellipsis   underline  "
            >
              <IoChatboxOutline size={22} />

            </Link>



          </div>
          <p className="text-white/60 text-sm mt-1 ">
            @{profile.username}{" "}
            <span className="text-white/40">
              • Joined {formatDateTime(profile.createdAt)}
            </span>
          </p>


          {profile?.level && parseInt(profile.level.toString().split("_")[1]) >= 4 && (
            <Level4 username={profile.username}  isMyprofile={false}/>
          )}






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



      <div className="     w-[96%]  mx-auto  mt-4">
        <div className=" w-full   md:w-full flex justify-between bg-newcolor rounded-lg border-2 border-[#13161B] px-4 py-2   ">
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
