import { useState } from "react";
import { User } from "../utils/type";
import { formatDateTime } from "../utils/date";
import UserTweets from "../ReusableComponents/UsertTweets";
import UserReposts from "../ReusableComponents/UserReposts";
import UserLikes from "../ReusableComponents/UserLikes";
import UserReplies from "../ReusableComponents/UserReplies";
import {
  getUserFollowerbyuserid,
  getUserFollowinguserid,
} from "../utils/apicalls";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SmallLoader from "../ReusableComponents/SmallLoader";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { IoCaretBack } from "react-icons/io5";
import TokenDetail from "../ReusableComponents/TokenDetail";
import UpdateUserModal from "../ReusableComponents/UpdateUserModel";
import toast from "react-hot-toast";
import { UpgradeModal } from "../ReusableComponents/UpgradeModal";
import SafeImage from "../ReusableComponents/SafeImage";
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
const ProfilePage = ({ user }: { user: User }) => {
  const tabs = ["Posts", "Replies", "Likes", "Repost"];
  const [activeTab, setActiveTab] = useState("Posts");

  const { handleLogout } = useAuth();

  const [isEditProfile, setIsEditProfile] = useState(false);

  const { data: userfollowing, isLoading: userfollowingloading } = useQuery({
    queryKey: [`UserFollowing:${user.username}`],

    queryFn: () => getUserFollowinguserid(user.id),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const [isUpgrading, setIsUpgrading] = useState(false)


  const handleLevelup = () => {
    if (parseInt(user.level.toString().split("_")[1]) >= 6) {
      toast.error("Your persona is already at the level 6", {
        style: {
          borderRadius: '20px',
          background: '#333',
          color: '#fff',
        },

      });
    } else {
      setIsUpgrading(true);

    }
  }


  const { data: userfollower, isLoading: userfollowerloading } = useQuery({
    queryKey: [`UserFollower:${user.username}`],

    queryFn: () => getUserFollowerbyuserid(user.id),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: usertweetscount, isLoading: usertweetloading } = useQuery({
    queryKey: [`tweetCount:${user.username}`],
    queryFn: () => GetTweetCount(user.id),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
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
      name: data.name ? data.name : user.name,
      profilephoto: profilePhotoUrl ? profilePhotoUrl : user.photoURL,
      coverPhoto: coverPhotoUrl ? coverPhotoUrl : user.coverPhotoURL,
      username: user.username,
      bio: data.bio ? data.bio : user.bio
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
  return (
    <>
      {user && (
        <div className="w-full   md:min-h-[98vh]  border-white/10   overflow-y-scroll  md:max-h-[98vh]  md:mt-[2vh]  mx-auto bg-primaryColor md:bg-newcolor2 text-white rounded-l-xl overflow-hidden  border-2 border-[#13181b]  ">
          {/* Cover Photo */}

          <UpgradeModal isOpen={isUpgrading} onClose={() => setIsUpgrading(false)} profile={user} isProfile={true} />

          <UpdateUserModal isUpdating={isUpdating} initialData={{ name: user.name, profilePhotoUrl: user.photoURL as string, coverPhotoUrl: user.coverPhotoURL as string, bio: user.bio }} isOpen={isEditProfile} onClose={() => setIsEditProfile(false)} onUpdate={handleUpdate} />
          <div className="">
            <div className="relative">
              <div className="relative w-full h-48">
                <img
                  src={user.coverPhotoURL || "/back.jpeg"}
                  alt="Cover"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-[#000000b1] mix-blend-multiply"></div>
              </div>

              <div className="absolute flex items-center  space-x-2 top-4 left-4 text-white text-lg font-semibold">
                <IoCaretBack className="cursor-pointer" onClick={handleClick} />
                <span>Profile</span>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
              


                {parseInt(user.level.toString().split("_")[1]) >= 2 &&

                  <button onClick={() => setIsEditProfile(!isEditProfile)} className=" border-white text-xs px-1 ss:text-sm md:text-base ss:px-2  md:px-4 py-1 rounded-full border hover:bg-white hover:text-black transition-all hover:border-black">Edit Profile</button>

                }
                <button
                  onClick={handleLogout}
                  className="border-white text-xs px-1 ss:text-sm md:text-base ss:px-2  md:px-4 py-1 rounded-full border hover:bg-white hover:text-black transition-all hover:border-black"
                >
                  Logout
                </button>

                {!user.isToken &&
                  <button onClick={handleLevelup} className=" px-1  ss:text-sm md:text-base bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br ss:px-2  md:px-4 py-1 rounded-full border border-white">
                    Upgrade
                  </button>}

              </div>
            </div>
          </div>

          <div className="grid grid-cols-18 pb-2 md:pb-10  w-[95%]  mx-auto ">
            <div className="relative flex flex-col  items-start  col-span-18    md:col-span-18    -mt-12">
            <SafeImage
            src={user.photoURL as string}
            alt="user"
            className=" w-20 h-20  md:w-24 md:h-24 rounded-full border  border-white"
          />
              <div className="flex items-center gap-x-2  w-full  ">
                <h2 className="text-sm mt-2  md:text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                  {user.name}
                </h2>

                {  user.isVerified  &&  <div className="mt-2"> 

                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#a200e8" className="size-6">
                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
        </svg>

                </div> }
                  <div className="flex items-center mt-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold ${user.level.toString() === 'LEVEL_0' ? 'bg-gray-500 text-white' :
                      user.level.toString() === 'LEVEL_1' ? 'bg-green-500 text-white' :
                        user.level.toString() === 'LEVEL_2' ? 'bg-blue-500 text-white' :
                          user.level.toString() === 'LEVEL_3' ? 'bg-purple-500 text-white' :
                            user.level.toString() === 'LEVEL_4' ? 'bg-yellow-500 text-black' :
                              user.level.toString() === 'LEVEL_5' ? 'bg-orange-500 text-white' :
                                'bg-red-500 text-white'
                    }`}>
                    {user.level.toString().split('_')[1]}
                  </div>
                </div>
              </div>

              <p className="text-white/60 text-sm mt-2 ">
                @{user.username}{" "}
                <span className="text-white/30">
                  {" "}
                  • Joined {formatDateTime(user.createdAt)}{" "}
                </span>
              </p>

              <div className="flex justify-between gap-x-2 mt-3 w-full  md:w-[40%] ">
                <div className="text-center flex gapx-x-1 w-full   items-center">
                  {userfollowingloading ? (
                    <SmallLoader />
                  ) : (
                    <p className="text-base font-semibold mx-1 ">
                      {userfollower?.data?.length}
                    </p>
                  )}
                  <Link to={`/following/${user.id}`}>
                    {" "}
                    <p className="text-white/60 text-sm ">Following</p>
                  </Link>

                </div>
                <div className="text-center flex gapx-x-1 w-full    items-center">
                  {userfollowerloading ? (
                    <SmallLoader />
                  ) : (
                    <p className="text-base font-semibold  ">
                      {userfollowing?.data?.length}
                    </p>
                  )}
                  <Link to={`/follower/${user.id}`}>
                    {" "}
                    <p className="text-white/60 text-sm mx-1 ">Followers</p>
                  </Link>

                </div>
                <div className="text-center flex gapx-x-1 w-full    items-center">
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
                {user.bio || "No bio yet"}
              </p>

              <div className="flex items-center gap-x-2  mt-4  ml-1 ">
                <span className="text-xl   text-white text-white/60 ">
                  {(user?.Points || 0).toLocaleString()}
                </span>
                <div className="bg-white/10 py-1 px-2  rounded-full">
                  <span className="text-white/60 text-xs">points</span>
                </div>
              </div>

              {user.isToken && <TokenDetail publicKey={user.publicKey as string} />}

            </div>


          </div>

          <div className="     w-[96%]  mx-auto  mt-4">
            <div className=" w-full  md:w-full  px-4 py-2  flex justify-between mx-auto bg-newcolor rounded-lg border-2 border-[#13161B]   ">
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
                <UserTweets userId={user.id} />
              </>
            )}

            {activeTab == "Replies" && (
              <>
                <UserReplies user={user} />
              </>
            )}

            {activeTab == "Likes" && (
              <>
                <UserLikes id={user.id} />
              </>
            )}

            {activeTab == "Repost" && (
              <>
                <UserReposts id={user.id} />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
