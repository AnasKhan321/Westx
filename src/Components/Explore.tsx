import { useQuery } from "@tanstack/react-query";
import { useState, ChangeEvent, KeyboardEvent } from "react";
import { FaSearch } from "react-icons/fa";
import { getTrending } from "../utils/apicalls";
import { useNavigate } from "react-router-dom";
import TrendingSection from "./TrendingSection";
import SmallLoader from "../ReusableComponents/SmallLoader";
import { useSocket } from "../Context/SocketContext";
import LiveSection from "./LiveSection";
const RightSidebar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const {  live } = useSocket();

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
    if (e.key === "Enter" && search.trim()) {
      navigate(`/explore/${search}`);
    }
  };

  return (
    <div className=" min-h-screen  w-full bg-primaryColor text-white flex flex-col  px-4 py-6 space-y-6">
      <div className="flex items-center max-w-lg ">
        <div className="bg-[#191919] p-3 rounded-l-full border-l border-t border-b border-white/10  ">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search WestX"
          value={search}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-2 bg-[#191919] border-b border-t border-r  border-white/10   text-white placeholder-gray-400 rounded-r-full focus:outline-none"
        />
      </div>

      {isLoading && (
        <div>
          {" "}
          <SmallLoader />{" "}
        </div>
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
       <LiveSection/> 
      )}

      <footer className="text-gray-400 text-xs mt-auto space-y-1 text-center  ">
        <p>
          Terms of Service <span className="mx-1">•</span> Privacy Policy{" "}
          <span className="mx-1">•</span> Cookie Policy
        </p>
        <p>© 2025 WestX AI</p>
      </footer>
    </div>
  );
};

export default RightSidebar;
