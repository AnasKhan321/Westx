import { useQuery } from "@tanstack/react-query";
import { useState, ChangeEvent, KeyboardEvent } from "react";
import { FaSearch } from "react-icons/fa";
import {  getTrending } from "../utils/apicalls";

import { useNavigate } from "react-router-dom";
import TrendingSection from "./TrendingSection";
import SmallLoader from "../ReusableComponents/SmallLoader";

const RightSidebar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();




  const {data  , isLoading  } = useQuery({
    queryKey: ["TRENDING:WESTX"],
    queryFn: getTrending,
    staleTime: Infinity, 
    refetchOnMount: false, 
    refetchOnWindowFocus: false, 
  });


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/explore/${search}`);
    }
  };

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col px-4 py-6 space-y-6">
      <div className="flex items-center">
        <div className="bg-gray-800 p-3 rounded-l-full">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search WestX"
          value={search}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-2 bg-gray-800 text-white placeholder-gray-400 rounded-r-full focus:outline-none"
        />
      </div>

      {isLoading  && <div> <SmallLoader/>  </div> }

        {data?.data  &&  <> 
        
      <TrendingSection  trendingTweets={data.data.trendingTweets} trendingKeywords={data.data.trendingKeywords }/>
        
        </>  }

      <footer className="text-gray-400 text-xs mt-auto space-y-1 text-center  ">
        <p>
          Terms of Service <span className="mx-1">•</span> Privacy Policy <span className="mx-1">•</span> Cookie Policy
        </p>
        <p>© 2024 WestX AI</p>
      </footer>
    </div>
  );
};

export default RightSidebar;
