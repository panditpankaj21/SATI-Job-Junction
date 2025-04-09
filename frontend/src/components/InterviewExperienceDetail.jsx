import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import CommentSection from "./CommentSection";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { BiUpvote } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { BiSolidUpvote } from "react-icons/bi";

const InterviewExperienceDetail = () => {
  const { id } = useParams();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchData();
  }, []);

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
        fetchData();
        
      } catch (error) {
        console.error('Error upvoting post:', error);
      } 
    };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/v1/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(res.data)
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

  const renderContent = (html) => {
    // If content doesn't contain h1 tags, render it directly with styling
    if (!html.includes('<h1>')) {
      return (
        <div 
          className="text-gray-300 content-container"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }

    // Otherwise, split by h1 tags
    return (
      <div className="content-container space-y-6">
        {html.split('<h1>').map((section, index) => {
          if (index === 0 && !section.includes('</h1>')) {
            // Handle content before first h1 if any
            return (
              <div 
                key="pre-content"
                className="text-gray-300"
                dangerouslySetInnerHTML={{ __html: section }}
              />
            );
          }
          
          if (index === 0) return null; // Skip empty first item
          
          const [title, ...contentParts] = section.split('</h1>');
          const content = contentParts.join('</h1>');
          
          return (
            <div key={index} className="section-group">
              <h2 className="text-2xl font-bold text-purple-300 mb-4 border-b border-purple-600 pb-2">
                {title}
              </h2>
              <div 
                className="section-content text-gray-300"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          );
        })}
      </div>
    );
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
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-800">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
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
        
        <div className="content-wrapper">
          {/* Apply global content styles */}
          <style jsx global>{`
            .content-container h2 {
              color: #d8b4fe;
              font-size: 1.5rem;
              font-weight: 600;
              margin-top: 2rem;
              margin-bottom: 1rem;
              border-bottom: 1px solid #6b21a8;
              padding-bottom: 0.5rem;
            }
            
            .content-container p {
              color: #d1d5db;
              margin-bottom: 1rem;
              line-height: 1.6;
            }
            
            .content-container ul, 
            .content-container ol {
              margin-left: 1.5rem;
              margin-bottom: 1.5rem;
              color: #d1d5db;
            }
            
            .content-container li {
              margin-bottom: 0.5rem;
              position: relative;
              line-height: 1.5;
            }
            
            .content-container ul li::before {
              content: "•";
              color: #a78bfa;
              font-weight: bold;
              display: inline-block;
              width: 1em;
              margin-left: -1em;
            }
            
            .content-container ol {
              counter-reset: item;
            }
            
            .content-container ol li {
              counter-increment: item;
            }
            
            .content-container ol li::before {
              content: counter(item) ".";
              color: #a78bfa;
              font-weight: bold;
              display: inline-block;
              width: 1.5em;
              margin-left: -1.5em;
            }
            
            .content-container strong {
              color: #e9d5ff;
              font-weight: 600;
            }
          `}</style>
          
          {renderContent(experience.content)}
        </div>

        <div className="mt-5 flex items-center gap-[1px] text-white">
          <div 
            className="flex items-center justify-center gap-1 cursor-pointer bg-gray-600 rounded-l px-2 py-1 hover:bg-gray-500"
            onClick={() => handleUpvote(experience._id)}
          >
            {experience.upvotedBy?.includes(currentUser._id) ? 
              <BiSolidUpvote className="text-purple-400 "/> :  
              <BiUpvote className="text-gray-400 hover:text-purple-400" />
            }
            <span className="">{experience.upvotes || 0}</span>
          </div>
          <div 
            className="flex items-center justify-center gap-1 cursor-pointer bg-gray-600 rounded-r px-2 py-1 hover:bg-gray-500"
            onClick={() => navigate(`/post/${exp._id}`)}
          >
            <FaRegComment className="text-gray-400 hover:text-purple-400" />
            <span className="">{experience.commentCount}</span>
          </div>
        </div>
        
        <CommentSection postId={id} />
      </div>
      <Footer/>
    </div>
  );
};

export default InterviewExperienceDetail;