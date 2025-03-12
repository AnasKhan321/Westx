import { useQuery } from "@tanstack/react-query";
import { getTrending } from "../utils/apicalls";
import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import SmallLoader from "../ReusableComponents/SmallLoader";
import TrendingSection from "./TrendingSection";
import SEO from "../ReusableComponents/SEO";


const Search = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["TRENDING:WESTX"],
    queryFn: getTrending,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });



  

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  const handleClick = () => {
   
      navigate(`/explore/${search}`);
   
  };
  return (
    <div className=" min-h-screen  w-full bg-primaryColor text-white flex flex-col  px-4 py-6 space-y-6">
      <SEO title={ "Search"} description={"Search page where you can search for a user"} />
      <div className=" w-full  grid grid-cols-14 ">

        <input
          type="text"
          placeholder="Search WestX"
          value={search}
          onChange={handleChange}
          className="  col-span-12 rounded-l-full  px-4 py-2  bg-secondaryColor border-b border-t border-r  border-white/10   text-white placeholder-gray-400 focus:outline-none"
        />

        <button onClick={handleClick} className=" bg-purple-700  rounded-r-full  col-span-2 text-center flex items-center justify-center  " > <FaSearch className="text-center"/>  </button>
      </div>

      {isLoading && (
        <div>
          {" "}
          <SmallLoader />{" "}
        </div>
      )}

      {data?.data && (
        <>
        {data.success && 
          <TrendingSection
            trendingTweets={data.data.trendingTweets}
            trendingKeywords={data.data.trendingKeywords}
          />}
        </>
      )}
    </div>
  );
};

export default Search;
