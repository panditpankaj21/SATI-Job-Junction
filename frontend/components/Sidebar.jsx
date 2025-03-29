import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";
import axios from "axios";

const Sidebar = ({ onSearch, onAddExperience, onVerifyRequest }) => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(["Google", "Amazon", "Microsoft"]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      updateRecentSearches(searchQuery);
    }
  };

  const updateRecentSearches = (query) => {
    const updatedSearches = [query, ...recentSearches].slice(0, 3); 
    setRecentSearches(updatedSearches);
  };

  const handleRecentSearchClick = (query) => {
    setSearchQuery(query); 
    onSearch(query);
  };

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/v1/users/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(response.data.user);
    }
    fetchData();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="w-64 m-2 text-white">
      {/* User Profile */}
      <div className="flex flex-col items-center mb-2 bg-gray-900 p-5 rounded-xl">
        <img
          src={user.avatar || "/img/user.png"}
          alt="User"
          className="w-20 h-20 rounded-full mb-4"
        />
        <h3 className="text-lg font-bold">{user.name}</h3>
        <p className="text-gray-400 flex items-center gap-1">{user.email} <MdVerifiedUser className="text-green-300"/></p>
        <button 
          className={`border px-3 py-1 cursor-pointer rounded mt-1 ${
            user.verified 
              ? "bg-green-900/40 border-green-500" 
              : "bg-yellow-900/40 border-yellow-500 hover:bg-yellow-900/75"
          }`}
          onClick={() => onVerifyRequest(user.email)}
          disabled={user.verified}
        >
          {user.verified ? "Verified" : "Verify"}
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-900 p-5 rounded-xl">
        <form onSubmit={handleSearch} className="">
          <label>Company Name</label>
          <div className="flex items-center mt-2 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company..."
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="bg-purple-600 absolute right-0 p-3 rounded-r hover:bg-purple-700 transition duration-300"
            >
              <FaSearch className="text-white" />
            </button>
          </div>
        </form>

        {/* Recently Searched Keywords */}
        {recentSearches.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm text-gray-400 mb-2">Recent Searches:</h4>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(query)}
                  className="flex items-center bg-gray-700 text-white px-2 py-1 rounded-full text-sm hover:bg-gray-600 transition duration-300"
                >
                  <FaSearch className="mr-1" />
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-2">
        <button
          onClick={onAddExperience}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition duration-300"
        >
          + Add Yours
        </button>
      </div>
    </div>
  );
};

export default Sidebar;