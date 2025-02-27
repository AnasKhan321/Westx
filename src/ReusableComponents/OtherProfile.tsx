import  { useState } from "react";
import { User } from "../utils/type";
import UserTweets from "./UsertTweets";
import UserReplies from "./UserReplies";
import UserLikes from "./UserLikes";
import UserReposts from "./UserReposts";
import { formatDateTime } from "../utils/date";

const OtherProfile = ({ user }: { user: User }) => {
  const tabs = ["Posts", "Replies", "Likes", "Repost"];
  const [activeTab, setActiveTab] = useState("Posts");
  return (
    <div className="w-full  min-h-[96vh]  overflow-y-scroll  max-h-[96vh]  my-[2vh]  mx-auto bg-secondaryColor text-white rounded-xl overflow-hidden border border-gray-700">
      {/* Cover Photo */}

      <div className="">
        <div className="relative">
          <img
            src={user.coverPhotoURL as string}
            alt="Cover"
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-4 left-4 text-white text-lg font-semibold">
            Profile
          </div>
          <div className="absolute top-4 right-4 flex space-x-2">
            <button className="bg-purple-800 px-4 py-1 rounded-full border border-white">
              Upgrade
            </button>
            <button className="bg-white text-black px-4 py-1 rounded-full border border-black">
              Logout
            </button>
          </div>
        </div>
      </div>

    

      <div className="grid grid-cols-18 pb-10 border-b border-white/40 w-[95%]  mx-auto ">
        <div className="relative flex flex-col  items-start  col-span-7    -mt-12">
          <img
            src={user.photoURL as string}
            alt="Profile"
            className="w-24 h-24 rounded-full border  border-white"
          />
          <h2 className="text-xl font-semibold mt-2">{user.name}</h2>
          <p className="text-white/60 text-sm mt-2 ">
            @{user.username} • Joined {formatDateTime(user.createdAt)}
          </p>
        </div>

        <div className="col-span-11 flex justify-around items-center mx-2">
          <div className="text-center">
          <p className="text-white/60 text-sm">Following</p>

            <p className="text-lg font-semibold">12</p>
          </div>
          <div className="text-center">
          <p className="text-white/60 text-sm">Followers</p>

            <p className="text-lg font-semibold">12</p>
          </div>
          <div className="text-center">
          <p className="text-white/60 text-sm">Tweets</p>

            <p className="text-lg font-semibold mt-2">12</p>
          </div>
        </div>
      </div>

      <div className="     w-[95%]  mx-auto  mt-4">
        <div className="w-[50%] flex justify-between   ">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={` ${
              activeTab === tab
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
  );
};

export default OtherProfile;
