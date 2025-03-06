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
import { useToken } from "../Context/TokenContext";
import TokenDetail from "../ReusableComponents/TokenDetail";
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
  const { handleTokenLaucnh } = useToken();

  const { data: userfollowing, isLoading: userfollowingloading } = useQuery({
    queryKey: [`UserFollowing:${user.username}`],

    queryFn: () => getUserFollowinguserid(user.id),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

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

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <>
      {user && (
        <div className="w-full  min-h-[96vh] border border-white/10   overflow-y-scroll  max-h-[96vh]  my-[2vh]  mx-auto bg-primaryColor md:bg-secondaryColor text-white rounded-xl overflow-hidden  ">
          {/* Cover Photo */}

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
                {!user.isToken &&
                  <button onClick={() => handleTokenLaucnh(user.name, user.photoURL, user.username)} className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br px-4 py-1 rounded-full border border-white">
                    Upgrade
                  </button>}
                <button
                  onClick={handleLogout}
                  className="border-white  px-4 py-1 rounded-full border hover:bg-white hover:text-black transition-all hover:border-black"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-18 pb-2 md:pb-10 border-b border-white/40 w-[95%]  mx-auto ">
            <div className="relative flex flex-col  items-start  col-span-15    md:col-span-8    -mt-12">
              <img
                src={user.photoURL as string}
                alt="user"
                className="md:w-24 md:h-24 w-20
               h-20  rounded-full border  border-white"
              />
              <h2 className=" text-base  md:text-xl font-semibold mt-2">
                {user.name}
              </h2>
              <p className="text-white/60 text-sm mt-2 ">
                @{user.username}{" "}
                <span className="text-white/30">
                  {" "}
                  • Joined {formatDateTime(user.createdAt)}{" "}
                </span>
              </p>

              <div className="flex justify-between gap-x-2 mt-5 w-[95%] ">
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

            </div>

            <div className=" col-span-18  md:col-span-10 py-8   md:py-0    flex justify-between md:justify-around items-center mx-2">
                    <TokenDetail publicKey={user.publicKey as string} />
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
