import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

const InterviewExperienceForm = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [author, setAuthor] = useState("");
  const [experience, setExperience] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExperience = {
      id: Date.now(), // Use a unique ID
      title,
      companyName,
      author,
      experience,
      updateDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
    };
    // Save the experience (you can replace this with an API call or state update)
    console.log("New Experience:", newExperience);
    onClose(); // Close the modal after submission
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
          <ReactQuill
            value={experience}
            onChange={setExperience}
            theme="snow"
            placeholder="Write your experience..."
            className="text-white rounded bg-gray-700"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition duration-300"
        >
          Submit Experience
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