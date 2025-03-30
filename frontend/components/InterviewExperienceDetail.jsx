import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MdVerified } from "react-icons/md";

const InterviewExperienceDetail = () => {
  const { id } = useParams();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/v1/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setExperience(res.data);
    } catch (error) {
      console.error('Error fetching experience: ', error);
      setError("Failed to load interview experience");
    } finally {
      setLoading(false);
    }
  };

  const convertDate = (d) => {
    const date = new Date(d);
    return date.toLocaleString("en-US", {
      month: "long", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-800 p-6">
        <div className="max-w-4xl mx-auto animate-pulse">
          {/* Header Skeleton */}
          <div className="mb-6">
            <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="flex items-center gap-2">
              <div className="h-5 bg-gray-700 rounded w-1/4"></div>
              <div className="h-3 bg-gray-700 rounded w-4"></div>
              <div className="h-5 bg-gray-700 rounded w-1/4"></div>
              <div className="h-3 bg-gray-700 rounded w-4"></div>
              <div className="h-5 bg-gray-700 rounded w-1/3"></div>
            </div>
          </div>
          
          {/* Content Skeleton */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            <div className="h-4 bg-gray-700 rounded w-4/5"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          </div>
          
          {/* Additional content blocks */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mt-6 space-y-3">
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-4/5"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <button 
            onClick={fetchData}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-800">
      <div className="max-w-4xl mx-auto p-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-400 mb-2">
            {experience.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
            <span className="text-gray-400 bg-gray-700 px-3 py-1 rounded-full">
              {experience.companyName}
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">
              {convertDate(experience.updatedAt)}
            </span>
            <span className="text-gray-500">•</span>
            <div className="flex items-center gap-1">
              <span className="text-gray-400">
                {experience.user.name || experience.user.email.split('@')[0]}
              </span>
              {experience.user.isVerified && (
                <MdVerified className="text-purple-400" />
              )}
            </div>
          </div>
        </div>
        
        <div className="prose prose-invert max-w-none">
          <div
            className="text-gray-300"
            dangerouslySetInnerHTML={{ __html: experience.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default InterviewExperienceDetail;