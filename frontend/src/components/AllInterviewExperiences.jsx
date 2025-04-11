import React, { useEffect, useState } from "react";
import { MdVerified } from "react-icons/md";
import axios from 'axios';
import { FaTags, FaRegComment } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { BiUpvote, BiSolidUpvote } from "react-icons/bi";

const AllInterviewExperiences = ({
  searchQuery,
  updateExperience
}) => {
  const navigate = useNavigate();
  const [experience, setExperience] = useState([]);
  const [filteredExperience, setFilteredExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(()=>{
    setLoading(true)
    fetchCurrentUser();
    fetchData(currentPage);
    setLoading(false)
  }, [currentPage, searchQuery]);

  const fetchCurrentUser = async () => {
    try{
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/v1/users/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setCurrentUser(res.data.user);
    } catch (error){
      console.error('Error fetching current user: ', error);
    }
  }

  const fetchData =  async (page, query = "") => {
    try{
      let url = `${import.meta.env.VITE_BACKEND_URI}/api/v1/posts?page=${page}&limit=4`;
      if(query) {
        url += `&search=${query}`;
      }

      const res = await axios.get(url, {
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      setExperience(res.data.posts);
      setFilteredExperience(res.data.posts);
      setTotalPages(res.data.totalPages);
    } catch (error){
      console.error("Error fetching data: ", error);
    } finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    if (searchQuery) {
      
      fetchData(1, searchQuery);
    } 
  }, [searchQuery, experience]);


  const handleDeleteClick = (postId) => {
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URI}/api/v1/posts/${postToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchData(currentPage);
    } catch (error) {
      console.log('Error while deleting the post: ', error);
    } finally {
      setShowDeleteModal(false);
      setPostToDelete(null);
    }
  };

  const handleUpvote = async (postId) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/posts/${postId}/upvote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        },
      );
      fetchData(currentPage);
      
    } catch (error) {
      console.error('Error upvoting post:', error);
    } 
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  const handleEdit = async (exp) => {
    updateExperience(exp._id, exp.title, exp.content, exp.companyName);
  }

  const handleNextPage = () => {
    if(currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if(currentPage > 1) setCurrentPage(prev => prev - 1);
  }

  const convertDate = (d) => {
    const date = new Date(d);
    const formattedDate = date.toLocaleString("en-US", {
        month: "long", 
        day: "numeric", 
        year: "numeric" 
    });
    return formattedDate;
  }

  const isNewExperience = (updateDate) => {
    const currentDate = new Date();
    const experienceDate = new Date(updateDate);
    const timeDifference = currentDate - experienceDate;
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    return daysDifference <= 5;
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  if(loading){
    return (
      <div className="md:w-[70%] w-full mx-auto mb-5">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
          Interview Experiences
        </h2>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700/30 animate-pulse"
            >
              <div className="flex justify-between items-start">
                <div className="w-full">
                  <div className="h-6 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-lg w-3/4 mb-4"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-lg w-1/2 mb-3"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-lg w-1/3 mb-3"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-lg w-1/4 mb-3"></div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="h-3 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-lg w-full"></div>
                <div className="h-3 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-lg w-5/6"></div>
                <div className="h-3 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-lg w-4/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="md:w-[70%] w-full p-2 md:p-0 mx-auto mb-5">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 w-full max-w-md border border-red-500/30">
            <div className="flex flex-col items-center">
              <RiDeleteBin6Line className="text-red-500 text-5xl mb-4 transform hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-500 mb-2">
                Delete Experience
              </h3>
              <p className="text-gray-300 text-center mb-6">
                Are you sure you want to delete this interview experience? This action cannot be undone.
              </p>
              
              <div className="flex gap-4 w-full">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-gray-700/50 to-gray-800/50 text-white hover:from-gray-600/50 hover:to-gray-700/50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-red-600/90 to-red-700/90 text-white hover:from-red-500/90 hover:to-red-600/90 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <RiDeleteBin6Line />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
        Interview Experiences
        {searchQuery && (
          <span className="text-sm text-gray-400 ml-2">
            (Search results for "{searchQuery}")
          </span>
        )}
      </h2>

      <div className="space-y-4">
        {filteredExperience.length > 0 ? (filteredExperience.map((exp) => (
          <div
            key={exp._id}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300 relative group hover:-translate-y-1"
          >
            <div className="absolute top-4 right-4 flex items-center gap-3">
              <div className="flex">
                {currentUser?._id === exp.user._id && 
                (<div className="flex text-xl gap-2">
                  <MdOutlineEdit 
                    className="text-blue-400 hover:text-blue-300 cursor-pointer transform hover:scale-110 transition-all duration-300"
                    onClick={() => handleEdit(exp)}
                  />
                  <RiDeleteBin6Line 
                    onClick={() => handleDeleteClick(exp._id)} 
                    className="text-red-500 hover:text-red-400 cursor-pointer transform hover:scale-110 transition-all duration-300"
                  />
                </div>)}
              </div>
              <div>
                {exp.user.isVerified && (
                <div className="text-purple-400 ml-2">
                  <MdVerified className="text-xl transform group-hover:scale-110 transition-transform duration-300" />
                </div>
                )}
              </div>
            </div>

            {isNewExperience(exp.createdAt) && (
              <div className="absolute top-0 left-0 bg-gradient-to-r from-green-600/90 to-green-700/90 backdrop-blur-sm rounded-r-xl text-white px-3 py-1 text-xs font-medium transform group-hover:scale-105 transition-transform duration-300">
                <div className="flex justify-center items-center gap-1">
                  <FaTags />
                  <p>New</p>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="w-full">
                <h3
                  className="text-xl font-bold cursor-pointer text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-1 hover:from-purple-300 hover:to-pink-300 transition-all duration-300"
                  onClick={() => navigate(`/post/${exp._id}`)}
                >
                  {exp.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-gray-300 rounded-lg bg-gradient-to-r from-gray-700/50 to-gray-800/50 px-3 py-1 border border-gray-600/30">
                    {exp.companyName}
                  </span>
                  <span className="text-gray-500">|</span>
                  <span className="text-gray-400 font-light">{convertDate(exp.createdAt)}</span>
                  {exp.createdAt !== exp.updatedAt && (
                    <>
                      <span className="text-gray-500">|</span>
                      <span className="text-gray-400 text-sm font-light">
                        edited: {convertDate(exp.updatedAt)}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-gray-400 mt-2 text-sm">{exp.user.email}</p>
              </div>
            </div>

            <div
              className="text-gray-300 mt-4 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: truncateText(exp.content, 100) }}
            />
    
            <div className="mt-5 flex items-center gap-5">
              <div 
                className="flex items-center justify-center gap-1 cursor-pointer group"
                onClick={() => handleUpvote(exp._id)}
              >
                {exp.upvotedBy?.includes(currentUser._id) ? 
                  <BiSolidUpvote className="text-purple-400 text-xl group-hover:text-purple-300 transform group-hover:scale-110 transition-all duration-300"/> :  
                  <BiUpvote className="text-gray-400 group-hover:text-purple-400 text-xl transform group-hover:scale-110 transition-all duration-300" />
                }
                <span className="text-gray-300 group-hover:text-purple-400 transition-colors">
                  {exp.upvotes || 0}
                </span>
              </div>
              <div 
                className="flex items-center justify-center gap-1 cursor-pointer group"
                onClick={() => navigate(`/post/${exp._id}`)}
              >
                <FaRegComment className="text-gray-400 group-hover:text-purple-400 text-xl transform group-hover:scale-110 transition-all duration-300" />
                <span className="text-gray-300 group-hover:text-purple-400 transition-colors">
                  {exp.commentCount}
                </span>
              </div>
            </div>
          </div>
        ))) : (
          <div className="text-center py-10 text-gray-400 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/30">
            <p className="text-lg">
              {searchQuery ? (
                `No experiences found for "${searchQuery}"`
              ) : (
                "No experiences available yet"
              )}
            </p>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center mt-8">
        <div className="flex items-center gap-2 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-700/30">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5 ${
              currentPage === 1 
                ? "bg-gradient-to-r from-gray-700/50 to-gray-800/50 text-gray-500 cursor-not-allowed" 
                : "bg-gradient-to-r from-gray-700/50 to-gray-800/50 text-white hover:from-purple-600/50 hover:to-purple-700/50 cursor-pointer"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Previous</span>
          </button>
          
          <div className="flex items-center gap-2 mx-2">
            <div className="flex items-center gap-1 bg-gradient-to-r from-gray-700/50 to-gray-800/50 px-3 py-2 rounded-lg">
              <span className="text-purple-400 font-semibold">{currentPage}</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-400">{totalPages}</span>
            </div>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5 ${
              currentPage === totalPages 
                ? "bg-gradient-to-r from-gray-700/50 to-gray-800/50 text-gray-500 cursor-not-allowed" 
                : "bg-gradient-to-r from-gray-700/50 to-gray-800/50 text-white hover:from-purple-600/50 hover:to-purple-700/50 cursor-pointer"
            }`}
          >
            <span className="font-medium">Next</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllInterviewExperiences;