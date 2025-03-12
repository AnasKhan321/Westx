import { useQuery } from "@tanstack/react-query";
import { useState, ChangeEvent, KeyboardEvent } from "react";
import { FaSearch } from "react-icons/fa";
import { getTrending } from "../utils/apicalls";
import { Link, useNavigate } from "react-router-dom";
import TrendingSection from "./TrendingSection";
import { useSocket } from "../Context/SocketContext";
import LiveSection from "./LiveSection";
import toast from "react-hot-toast";
const RightSidebar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { live } = useSocket();

  const { data, isLoading } = useQuery({
    queryKey: ["TRENDING:WESTX"],
    queryFn: getTrending,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === '#'  || e.key === "%") {
        e.preventDefault();
        return;
      }
    if (e.key === "Enter" && search.trim()) {

      if(search.includes("#") || search.includes("%") ){
        toast.error("Invalid Search Query !"  , {
          style: {
            borderRadius: '20px',
            background: '#333',
            color: '#fff',
          },
        })
        return;
      }
      navigate(`/explore/${search}`);
    }
  };

  return (
    <div className=" min-h-screen  w-full bg-primaryColor text-white flex flex-col  px-4 py-6 space-y-6">
      <div className="flex items-center w-full ">
        <div className="bg-[#191919] p-3 rounded-l-full border-l border-t border-b border-white/10  ">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search WestX"
          value={search}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
         pattern="[^#]*"
          className="w-full px-4 py-2 bg-[#191919] border-b border-t border-r  border-white/10   text-white placeholder-gray-400 rounded-r-full focus:outline-none"
        />
      </div>

      {isLoading && (
        <LiveLoading/>
      )}

      {!live && data?.data && (
        <>
          <TrendingSection
            trendingTweets={data.data.trendingTweets}
            trendingKeywords={data.data.trendingKeywords}
          />
        </>
      )}

      {live && (
        <LiveSection />
      )}



      <footer className="text-gray-400 text-xs mt-auto space-y-1 text-center  ">
        <p>
          Terms of Service <span className="mx-1">•</span>  <Link to="/privacy-policy" className=" cursor-pointer hover:text-gray-300">  Privacy Policy{" "} </Link> 
          <span className="mx-1">•</span> <Link to="/cookie-policy" className=" cursor-pointer hover:text-gray-300"> Cookie Policy</Link>
        </p>
        <p>© 2025 WestX AI</p>
      </footer>
    </div>
  );
};


const LiveLoading = ()=>{
  return(
    <div className="min-h-[80vh] max-h-[80vh]  w-full bg-secondaryColor rounded-lg">
    <div className="w-[40%]  m-4  bg-gray-700 h-4 rounded-sm animate-pulse">

    </div>

    <div className="mt-5">

      {([1, 3, 4])?.map((_keyword, index) => (
        <div key={index} className="py-2 border-b border-white/10 mx-4 my-2 text-gray-300 text-base ">
          <div className="w-[40%]  bg-gray-700 h-4 rounded-sm animate-pulse">

          </div>
        </div>
      ))}

    </div>


    <div className="mt-10">
      <div className="w-[40%]  m-4  bg-gray-700 h-4 rounded-sm animate-pulse">

      </div>

      {([1, 2, 3  ])?.map((_keyword, index) => (
         <div
   
         className="border-b w-full grid grid-cols-12 border-gray-800 py-4 animate-pulse mx-4"
         key={index}
       >
         <div className="flex gap-3  col-span-3 md:col-span-2">
           <div className="w-12 h-12 mt-4 bg-gray-700 rounded-full"></div>
         </div>
         <div className="flex  justify-between col-span-9 md:col-span-10 items-center mt-4 w-5/5">
           <div className="flex-1">
             <div className="h-4 bg-gray-700 rounded w-1/3"></div>
             <div className="h-3 bg-gray-700 rounded w-1/2 mt-2"></div>
             <div className="h-3 bg-gray-700 rounded w-[85%] mt-2"></div>
           </div>
         </div>
       </div>
      ))}
    </div>
  </div>
  )
}

export default RightSidebar;
