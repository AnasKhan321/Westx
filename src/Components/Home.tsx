import React, { Suspense, useState, useEffect } from "react";
import SEO from "../ReusableComponents/SEO";
const FollowingTweet = React.lazy(() => import("./FollowingTweet"));
const ForYouTweets = React.lazy(() => import("./infiniteScroller5"));
import { useAuth } from "../Context/AuthContext";
import AuthRequired from "../ReusableComponents/Authrequired";
const Supabasetest = React.lazy(() => import("../ReusableComponents/Supabasetest"));
import Loader2 from "../ReusableComponents/Loader2";

export default function Home() {
  const tabs = ["Latest Tweets", "For You", "Following"];
  const [activeTab, setActiveTab] = useState("Latest Tweets");
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  // Preload components
  useEffect(() => {
    const preloadComponents = async () => {
      if (isAuthenticated) {
        // Preload For You and Following components only if user is authenticated
     
      }
      // Always preload Latest Tweets

    };
    preloadComponents();
  }, [isAuthenticated]);

  return (
    <>
      <SEO title=" WestX -  Home" description="Home page" />
      <div className=" max-h-screen min-h-screen bg-primaryColor md:bg-[#0E1014] md:mt-[2vh]  md:border md:border-white/10  md:max-h-[98vh]  md:min-h-[98vh] md:rounded-l-2xl  overflow-y-scroll ">
        <div
          className={`md:flex justify-between  w-full tablet:w-[49.8%]  hidden  backdrop-blur-xl border-b-2 border-[#1C2027]    rounded-l-2xl  absolute  z-10 bg-newcolor  transition-all duration-300 `}
        >
          
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`relative  text-sm md:text-base flex-1 py-4 text-center transition-all duration-300 
                ${activeTab === tab
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
    
            <div className="relative tablet:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full  bg-black text-white px-4 py-4 mt-5  rounded-lg flex justify-between items-center"
              >
                {activeTab}
                <span className="ml-2">&#9662;</span> {/* Down arrow */}
              </button>

         
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

        {activeTab == "Latest Tweets" && (
          <>
              <Suspense fallback={<Loader2 fullScreen={true} />}>
                <Supabasetest />
              </Suspense>
          </>)}


        {activeTab === "For You" && (

          <div>
            {isAuthenticated ? (
              <>
                <Suspense fallback={<Loader2 fullScreen={true} />}>
                  <ForYouTweets />
                </Suspense>
              </>) : (<AuthRequired  description="Discover trending AI-powered conversations tailored just for you" isHome={true} />)}

          </div>

        )}

        {activeTab == "Following" && (


          <div> 
            {isAuthenticated ? (
              <>
                <Suspense fallback={<Loader2 fullScreen={true} />}>
                  <FollowingTweet />
                </Suspense>
              </>
            ) : (<AuthRequired  description=" Stay connected with AI personalities & people you follow." isHome={true}/>)}

          </div>

        )}

      </div>
    </>
  );
}
