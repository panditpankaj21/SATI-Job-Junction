import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";
import axios from "axios";
import Avatar from "./Avatar";

const Sidebar = ({ onSearch, onAddExperience, onVerifyRequest }) => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(localStorage.getItem("recentSearches") || []);
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarChange = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
    updateRecentSearches(searchQuery);
    
  };

  const updateRecentSearches = (query) => {
    if (query.trim() === "") return;
    
    setRecentSearches(prev => {
      const withoutCurrent = prev.filter(item => item !== query);
      
      const updated = [query, ...withoutCurrent];
      
      const limited = updated.slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(limited));
      
      return limited;
    });
  };

  const handleRecentSearchClick = (query) => {
    setSearchQuery(query); 
    onSearch(query);
    updateRecentSearches(query);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/v1/users/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data.user);
        
        // Load recent searches from localStorage if available
        const savedSearches = localStorage.getItem('recentSearches');
        if (savedSearches) {
          setRecentSearches(JSON.parse(savedSearches));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) return <div className="w-64 m-2 text-white">Loading user...</div>;
  if (!user) return <div className="w-64 m-2 text-white">Please log in</div>;

  return (
    <div className="md:w-64 w-full m-2 text-white">
      {/* User Profile */}
      <div className="flex flex-col items-center mb-2 bg-gray-900 p-5 rounded-xl">
        <Avatar user={user} className="w-16 h-16 text-4xl" onAvatarChange={handleAvatarChange}/>
        <h3 className="text-lg font-bold">{user.name}</h3>
        <p className="text-gray-400 flex items-center gap-1">{user.email} {user.isVerified && <MdVerifiedUser className="text-green-300"/>}</p>
        {!user.isVerified && <button 
          className={`border px-3 py-1 cursor-pointer rounded mt-1 bg-yellow-900/40 border-yellow-500 hover:bg-yellow-900/75`}
          onClick={() => onVerifyRequest(user.email)}
        >
          Verify
        </button>}
      </div>

      {/* Search Bar */}
      <div className="bg-gray-900 p-5 rounded-xl">
        <form onSubmit={handleSearchSubmit} className="">
          <label>Company Name</label>
          <div className="flex items-center mt-2 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
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
                  <FaSearch className="mr-1 text-xs" />
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