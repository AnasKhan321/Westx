import React, {Suspense, useState } from "react";
import SEO from "../ReusableComponents/SEO";

const MyComponent = React.lazy(() => import("./infiniteScroller3"));
const FollowingTweet = React.lazy(() => import("./FollowingTweet"));
const ForYouTweets = React.lazy(() => import("./infiniteScroller5"));

export default function Home() {
  const tabs = ["Latest Tweets", "For You", "Following"];
  const [activeTab, setActiveTab] = useState("For You");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
    <SEO title=" WestX -  Home" description="Home page" />
      <div className=" max-h-screen min-h-screen bg-primaryColor md:bg-secondaryColor md:my-[2vh]  md:border md:border-white/10  md:max-h-[96vh]  md:min-h-[96vh]  md:rounded-2xl overflow-y-scroll ">
          <div
            className={`md:flex justify-between w-[49.9%]  hidden  backdrop-blur-xl   rounded-2xl absolute  z-10 bg-secondaryColor/10  transition-all duration-300 `}
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`relative  text-sm md:text-base flex-1 py-4 text-center transition-all duration-300 
                ${
                  activeTab === tab
                    ? "text-white font-bold before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-2/4 before:h-1 before:bg-purple-500 before:rounded-full"
                    : "text-gray-400 hover:text-white   "
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex md:hidden absolute z-10 top-0 bg-primaryColor w-full">
            <div className="w-full  mx-auto">
              {/* Dropdown Button */}
              <div className="relative md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full  bg-black text-white px-4 py-4 mt-5  rounded-lg flex justify-between items-center"
                >
                  {activeTab}
                  <span className="ml-2">&#9662;</span> {/* Down arrow */}
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div className="absolute z-10 left-0 right-0 mt-2 bg-black shadow-lg rounded-lg border">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => {
                          setActiveTab(tab);
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 bg-black hover:bg-secondaryColor"
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                )}
              </div>

     
            </div>
          </div>

        {activeTab == "Latest Tweets"  &&(
            <>
            <Suspense>
              <MyComponent /></Suspense>
            </>)}
      

          {activeTab === "For You" && (
            <>
        <Suspense>

              <ForYouTweets /></Suspense>
            </>
          )}

          {activeTab == "Following" && (
            <>
          <Suspense>
              <FollowingTweet /></Suspense>
            </>
          )}

      </div>
    </>
  );
}
