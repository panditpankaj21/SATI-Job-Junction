import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import axios from "axios";
import { FaSpinner, FaTimes } from "react-icons/fa";

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
    try {
      setIsLoading(true);
      if (isUpdate) {
        await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/posts/update/${id}`, newExperience, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/posts/add`, newExperience, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
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
    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700/50 max-w-3xl mx-auto">
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-white transform transition-all duration-300 hover:scale-110"
        onClick={onClose}
      >
        <FaTimes className="text-2xl" />
      </button>

      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8">
        {isUpdate ? 'Update Your Experience' : 'Share Your Interview Experience'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div className="group">
          <label className="block text-gray-300 mb-2 text-sm font-medium group-hover:text-purple-400 transition-colors duration-300">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white 
                     border border-gray-700/50 focus:border-purple-500/50 
                     focus:ring-2 focus:ring-purple-500/20 
                     transition-all duration-300 placeholder-gray-500"
            placeholder="Enter a descriptive title"
            required
          />
        </div>

        {/* Company Name Input */}
        <div className="group">
          <label className="block text-gray-300 mb-2 text-sm font-medium group-hover:text-purple-400 transition-colors duration-300">
            Company Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white 
                     border border-gray-700/50 focus:border-purple-500/50 
                     focus:ring-2 focus:ring-purple-500/20 
                     transition-all duration-300 placeholder-gray-500"
            placeholder="Enter company name"
            required
          />
        </div>

        {/* Experience Input (React Quill Editor) */}
        <div className="group">
          <label className="block text-gray-300 mb-2 text-sm font-medium group-hover:text-purple-400 transition-colors duration-300">
            Interview Experience
          </label>
          <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-300">
            <ReactQuill
              value={experience}
              onChange={setExperience}
              theme="snow"
              placeholder="Share your detailed interview experience..."
              className="text-white"
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['link', 'clean']
                ]
              }}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-gray-700/50 text-white 
                     hover:bg-gray-600/50 border border-gray-600/50 
                     hover:border-gray-500/50 transform transition-all duration-300 
                     hover:scale-105"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 
                     text-white hover:from-purple-500 hover:to-purple-600 
                     transform transition-all duration-300 hover:scale-105 
                     hover:shadow-lg hover:shadow-purple-500/20 
                     border border-purple-500/30 disabled:opacity-50 
                     disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" />
                {isUpdate ? "Updating..." : "Submitting..."}
              </>
            ) : (
              isUpdate ? 'Update' : 'Submit'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InterviewExperienceForm;