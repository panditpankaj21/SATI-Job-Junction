import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

const InterviewExperienceForm = ({ 
  onClose,
  oldTitle = '',
  oldCompanyName = '',
  oldExperience = '',
  isUpdate = false,
  id = '',
}) => {
  const [title, setTitle] = useState(oldTitle);
  const [companyName, setCompanyName] = useState(oldCompanyName);
  const [experience, setExperience] = useState(oldExperience);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newExperience = {
      title,
      companyName,
      content: experience,
    };
    try{
      setIsLoading(true)
      if(isUpdate){
        await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/posts/update/${id}`, newExperience, {
          headers:{
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/posts/add`, newExperience, {
          headers:{
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
      }

      setCompanyName('');
      setExperience('');
      setTitle('');
      onClose();
    } catch (error) {
      console.log('Error while posting the post: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="realtive">
      <h2 className="text-2xl font-bold text-white mb-6">Share Your Interview Experience</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-white mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter title"
            required
          />
        </div>

        {/* Company Name Input */}
        <div>
          <label className="block text-white mb-2">Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter company name"
            required
          />
        </div>

        {/* Experience Input (React Quill Editor) */}
        <div className="text-white">
          <label className="block text-white mb-2">Interview Experience</label>
          <div className="">
            <ReactQuill
              value={experience}
              onChange={setExperience}
              theme="snow"
              placeholder="Write your experience..."
              className=""
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex-1 py-2 px-4 rounded mr-3 bg-gray-700 text-white hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="bg-purple-600 text-white py-2 px-5 rounded hover:bg-purple-700 transition duration-300"
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              {isUpdate ? "Updating..." : "Submitting..."}
            </>
          ) : (
            <>
              {isUpdate ? 'Update' : 'Submit'}
            </>
          )}
        </button>
      </form>
        <button
          className="text-white text-2xl cursor-pointer py-2 px-4 absolute top-2.5 right-2.5"
          onClick={
            onClose
          }
        >
          X
        </button>
    </div>
  );
};

export default InterviewExperienceForm;