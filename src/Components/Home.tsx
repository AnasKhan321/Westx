import React, { Suspense, useState } from "react";
import Loader from "../ReusableComponents/Loader";
import FollowingTweet from "./FollowingTweet";
const MyComponent = React.lazy(() => import("./infiniteScroller3"));

export default function Home() {
  const tabs = ["For You", "Following"];
  const [activeTab, setActiveTab] = useState("For You");
  return (
    <>


      <Suspense fallback={<Loader/> }>
      <div className="  bg-black/10 border-b border-borderColor  z-10  flex gap-x-2 top-0 absolute font-bold   backdrop-blur-xl w-[100%]  md:w-[41.5%] ">

      {tabs.map((tab) => (
  <button
    key={tab}
    className={`relative flex-1 py-4 text-center transition-all duration-300 
                ${
                  activeTab === tab
                    ? "text-white font-bold before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-2/4 before:h-1 before:bg-purple-500 before:rounded-full"
                    : "text-gray-400 hover:text-white hover:bg-gray-800 "
                }`}
    onClick={() => setActiveTab(tab)}
  >
    {tab}
  </button>
))}

      </div> 

      {activeTab  == "For You"   && <> 
      
        <MyComponent />
      </>}

      {activeTab == "Following"   && <> 
      
        <div className="mt-16"></div>
        <FollowingTweet/> 
      </>}

      

      </Suspense>
    </>
  );
}
