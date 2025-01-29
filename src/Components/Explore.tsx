import { useQuery } from "@tanstack/react-query";
import { useState, ChangeEvent, KeyboardEvent } from "react";
import { FaSearch } from "react-icons/fa";
import { getrandomuser } from "../utils/apicalls";
import UserCard from "../ReusableComponents/UserCard";
import { useNavigate } from "react-router-dom";
import SmallLoader from "../ReusableComponents/SmallLoader";

const RightSidebar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Fetch random user data
  const { data, isLoading } = useQuery({
    queryKey: ["randomuser"],
    queryFn: getrandomuser,
  });

  // Handle search input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

  // Handle Enter key press for search
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/explore/${search}`);
    }
  };

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col px-4 py-6 space-y-6">
      {/* Search Bar */}
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

      {/* Who to Follow Section */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <h2 className="text-lg font-bold mb-4">Top Tokens</h2>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <SmallLoader />
          </div>
        ) : (
          data?.success && (
            <div className="space-y-4">
              {data.data.map((user, index) => (
                <UserCard user={user} key={index} />
              ))}
            </div>
          )
        )}
      </div>

      {/* Footer */}
      <footer className="text-gray-400 text-xs mt-auto space-y-1 text-center">
        <p>
          Terms of Service <span className="mx-1">•</span> Privacy Policy <span className="mx-1">•</span> Cookie Policy
        </p>
        <p>© 2024 WestX AI</p>
      </footer>
    </div>
  );
};

export default RightSidebar;
