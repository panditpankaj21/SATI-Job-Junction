import React, { useEffect, useState } from "react";
import { FaSearch, FaPlus, FaBookmark } from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";
import axios from "axios";
import Avatar from "./Avatar";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ onSearch, onAddExperience, onVerifyRequest }) => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(localStorage.getItem("recentSearches") || []);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

  if (isLoading) return (
    <div className="w-full md:w-64 m-2 p-4 bg-gray-900/50 backdrop-blur-sm rounded-xl animate-pulse">
      <div className="h-16 w-16 rounded-full bg-gray-700 mx-auto mb-4"></div>
      <div className="h-4 w-3/4 bg-gray-700 rounded mx-auto mb-2"></div>
      <div className="h-4 w-1/2 bg-gray-700 rounded mx-auto"></div>
    </div>
  );

  if (!user) return (
    <div className="w-full md:w-64 m-2 p-4 bg-gray-900/50 backdrop-blur-sm rounded-xl text-center text-white">
      Please log in
    </div>
  );

  return (
    <div className="w-full md:w-64 m-2 text-white">
      {/* User Profile */}
      <div className="flex flex-col items-center mb-4 bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl shadow-lg border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
        <div className="relative group">
          <Avatar user={user} className="w-20 h-20 text-4xl transform transition-transform duration-300 group-hover:scale-110" onAvatarChange={handleAvatarChange}/>
          {/* <div className="absolute inset-0 rounded-full bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}
        </div>
        <h3 className="text-xl font-bold mt-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{user.name}</h3>
        <p className="text-gray-400 flex items-center gap-1 mt-1">
          {user.email} 
          {user.isVerified && <MdVerifiedUser className="text-green-400 transform transition-transform duration-300 hover:scale-110"/>}
        </p>
        {!user.isVerified && (
          <button 
            className="mt-3 px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg 
                     hover:from-yellow-500 hover:to-yellow-600 transform transition-all duration-300 
                     hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20 border border-yellow-500/30"
            onClick={() => onVerifyRequest(user.email)}
          >
            Verify Account
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl shadow-lg border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">Search Companies</label>
          <div className="flex items-center relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Enter company name..."
              className="w-full p-3 rounded-lg bg-gray-800/50 text-white 
                       focus:outline-none focus:ring-2 focus:ring-purple-500 
                       border border-gray-700/50 group-hover:border-purple-500/30
                       transition-all duration-300"
            />
            <button
              type="submit"
              className="absolute right-2 p-2 bg-gradient-to-r from-purple-600 to-purple-700 
                       rounded-lg hover:from-purple-500 hover:to-purple-600 
                       transform transition-all duration-300 hover:scale-110"
            >
              <FaSearch className="text-white" />
            </button>
          </div>
        </form>

        {/* Recently Searched Keywords */}
        {recentSearches.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Recent Searches:</h4>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(query)}
                  className="flex items-center bg-gray-800/50 text-white px-3 py-1.5 rounded-full 
                           text-sm hover:bg-purple-600/50 hover:scale-105 
                           transform transition-all duration-300 border border-gray-700/50 
                           hover:border-purple-500/30"
                >
                  <FaSearch className="mr-2 text-xs" />
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-4">
        <button
          onClick={onAddExperience}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white 
                   py-3 px-4 rounded-lg hover:from-purple-500 hover:to-purple-600 
                   transform transition-all duration-300 hover:scale-105 hover:shadow-lg 
                   hover:shadow-purple-500/20 flex items-center justify-center gap-2
                   border border-purple-500/30 group"
        >
          <FaPlus className="text-lg transform group-hover:rotate-90 transition-transform duration-300" />
          Add Your Experience
        </button>

        <button
          onClick={() => navigate('/saved-items')}
          className="w-full bg-gradient-to-r from-gray-800 to-gray-700 text-white 
                   py-3 px-4 rounded-lg hover:from-gray-700 hover:to-gray-600 
                   transform transition-all duration-300 hover:scale-105 hover:shadow-lg 
                   hover:shadow-purple-500/10 flex items-center justify-center gap-2
                   border border-gray-600/30 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 
                         transform group-hover:scale-110 transition-transform duration-500"></div>
          <FaBookmark className="text-lg transform group-hover:scale-110 transition-transform duration-300 text-purple-400" />
          <span className="relative text-gray-300">Saved Items</span>
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500/30 to-pink-500/30 
                         transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;