import React, { useEffect, useState } from "react";
import { MdVerified } from "react-icons/md";
import axios from 'axios';
import { FaTags } from "react-icons/fa";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import InterviewExperienceForm from "./InterviewExperienceForm";

const AllInterviewExperiences = ({
  searchQuery,
  updateExperience
}) => {
  const navigate = useNavigate();
  const [experience, setExperience] = useState([]);
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
  }, [currentPage]);

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

  const fetchData =  async (page) => {
    try{
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/v1/posts?page=${page}&limit=4`, {
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      setExperience(res.data.posts);
      setTotalPages(res.data.totalPages);
    } catch (error){
      console.error("Error fetching data: ", error);
    }
  }

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
      <div className="w-[70%] mx-auto mb-5">
        <h2 className="text-2xl font-bold text-white mb-6">Interview Experiences</h2>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg shadow-lg"
            >
              <div className="animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="w-full">
                    <div className="h-6 bg-gray-600 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-600 rounded w-1/2 mb-3"></div>
                    <div className="h-4 bg-gray-600 rounded w-1/3 mb-3"></div>
                    <div className="h-4 bg-gray-600 rounded w-1/4 mb-3"></div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="h-3 bg-gray-600 rounded w-full"></div>
                  <div className="h-3 bg-gray-600 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-600 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-[70%] mx-auto mb-5">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-purple-500">
            <div className="flex flex-col items-center">
              <RiDeleteBin6Line className="text-red-500 text-5xl mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Delete Experience</h3>
              <p className="text-gray-300 text-center mb-6">
                Are you sure you want to delete this interview experience? This action cannot be undone.
              </p>
              
              <div className="flex gap-4 w-full">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 py-2 px-4 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-2 px-4 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <RiDeleteBin6Line />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-white mb-6">Interview Experiences</h2>

      <div className="space-y-4">
        {experience.map((exp) => {
          return (
            <div
              key={exp._id}
              className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
            >
              <div className="absolute top-2 right-2 flex">
                <div className="flex">
                  {currentUser?._id === exp.user._id && 
                  (<div className="flex text-xl gap-1">
                    <MdOutlineEdit 
                      className="text-blue-200 hover:text-blue-300 cursor-pointer"
                      onClick={() => handleEdit(exp)}
                    />
                    <RiDeleteBin6Line 
                      onClick={() => handleDeleteClick(exp._id)} 
                      className="text-red-500 hover:text-red-600 cursor-pointer"
                    />
                  </div>)}
                </div>
                <div>
                  {exp.user.isVerified && (
                  <div className=" text-purple-400 ml-2">
                    <MdVerified className="text-xl" />
                  </div>
                  )}
                </div>
              </div>

              {isNewExperience(exp.updatedAt) && (
                <div className="absolute top-0 left-0 bg-green-700 rounded-r text-white px-2 py-1 text-xs font-extralight">
                  <div className="flex justify-center items-center gap-1">
                    <FaTags />
                    <p>New</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-start">
                <div>
                  <h3
                    className="text-xl font-bold cursor-pointer text-purple-400 mb-1"
                    onClick={() => navigate(`/post/${exp._id}`)}
                  >
                    {exp.title}
                  </h3>
                  <span className="text-gray-400 mb-2 rounded bg-gray-700 px-1">{exp.companyName}</span>
                  <span className="rounded-full text-gray-500 mx-1"> | </span>
                  <span className="text-gray-400 text-sm font-light">{convertDate(exp.updatedAt)}</span>
                  <p className="text-gray-400 mt-1">{exp.user.email}</p>
                </div>
              </div>

              <div
                className="mt-4 text-gray-300"
                dangerouslySetInnerHTML={{ __html: truncateText(exp.content, 100) }}
              >
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-l bg-gray-700 text-white ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-600 cursor-pointer"}`}
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-800 text-white">{currentPage} / {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-r bg-gray-700 text-white ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-600 cursor-pointer"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllInterviewExperiences;