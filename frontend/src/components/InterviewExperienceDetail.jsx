import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import CommentSection from "./CommentSection";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { BiUpvote, BiSolidUpvote } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { motion } from "framer-motion";

const InterviewExperienceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [recLoading, setRecLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
    fetchData();
    fetchRecommendations();
  }, [id]);

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/v1/users/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCurrentUser(res.data.user);
    } catch (error) {
      console.error('Error fetching current user: ', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      setRecLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/v1/recommendations`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setRecommendations(response.data.recommendations);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setRecLoading(false);
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
      <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4 md:p-6">
        <div className="max-w-4xl mx-auto animate-pulse">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-700 rounded-lg w-3/4 mb-4"></div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="h-5 bg-gray-700 rounded-lg w-1/4"></div>
              <div className="h-3 bg-gray-700 rounded-lg w-4"></div>
              <div className="h-5 bg-gray-700 rounded-lg w-1/4"></div>
              <div className="h-3 bg-gray-700 rounded-lg w-4"></div>
              <div className="h-5 bg-gray-700 rounded-lg w-1/3"></div>
            </div>
          </div>
          
          {/* Content Skeleton */}
          <div className="space-y-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-700 rounded-lg w-full"></div>
            ))}
          </div>
          
          {/* Additional content blocks */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mt-8 space-y-4">
              <div className="h-4 bg-gray-700 rounded-lg w-2/3"></div>
              <div className="h-4 bg-gray-700 rounded-lg w-full"></div>
              <div className="h-4 bg-gray-700 rounded-lg w-4/5"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="text-center p-6 max-w-md mx-auto bg-gray-800 rounded-xl shadow-lg">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <button 
            onClick={fetchData}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-8 bg-gray-800 rounded-xl p-6 shadow-lg">
              <h1 className="text-2xl md:text-3xl font-bold text-purple-400 mb-4">
                {experience.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
                <span className="text-gray-400 bg-gray-700 px-3 py-1 rounded-full hover:bg-gray-600 transition-colors">
                  {experience.companyName}
                </span>
                <span className="text-gray-500 hidden sm:inline">•</span>
                <span className="text-gray-400">
                  {convertDate(experience.updatedAt)}
                </span>
                <span className="text-gray-500 hidden sm:inline">•</span>
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
            
            <div className="content-wrapper bg-gray-800 rounded-xl p-6 shadow-lg">
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
                  line-height: 1.7;
                  font-size: 1.05rem;
                }
                
                .content-container ul, 
                .content-container ol {
                  margin-left: 1.5rem;
                  margin-bottom: 1.5rem;
                  color: #d1d5db;
                }
                
                .content-container li {
                  margin-bottom: 0.75rem;
                  position: relative;
                  line-height: 1.6;
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

                .content-container code {
                  background-color: #2d3748;
                  padding: 0.2rem 0.4rem;
                  border-radius: 0.25rem;
                  font-family: monospace;
                }

                .content-container pre {
                  background-color: #2d3748;
                  padding: 1rem;
                  border-radius: 0.5rem;
                  overflow-x: auto;
                  margin: 1rem 0;
                }

                .content-container blockquote {
                  border-left: 4px solid #6b21a8;
                  padding-left: 1rem;
                  margin: 1rem 0;
                  color: #a0aec0;
                }
                .content-container a {
                  color:rgb(7, 138, 246);
                  text-decoration: underline;
                }
                
              `}</style>
              
              {renderContent(experience.content)}
            </div>

            <div className="mt-6 flex items-center gap-2">
              <div 
                className="flex items-center justify-center gap-2 cursor-pointer bg-gray-700 rounded-lg px-4 py-2 hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                onClick={() => handleUpvote(experience._id)}
              >
                {experience.upvotedBy?.includes(currentUser._id) ? 
                  <BiSolidUpvote className="text-purple-400 text-xl"/> :  
                  <BiUpvote className="text-gray-400 hover:text-purple-400 text-xl" />
                }
                <span className="text-gray-300">{experience.upvotes || 0}</span>
              </div>
              <div 
                className="flex items-center justify-center gap-2 cursor-pointer bg-gray-700 rounded-lg px-4 py-2 hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                onClick={() => navigate(`/post/${experience._id}`)}
              >
                <FaRegComment className="text-gray-400 hover:text-purple-400 text-xl" />
                <span className="text-gray-300">{experience.commentCount}</span>
              </div>
            </div>
            
            <div className="mt-9">
              <CommentSection postId={id} />
            </div>
          </div>

          {/* Recommendations Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="relative group">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
                    Recommended for You
                  </h3>
                  <p className="text-sm text-gray-400">Discover similar experiences</p>
                </div>
              </div>

              {recLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/2 mb-3"></div>
                      <div className="h-2 bg-gray-700 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : recommendations.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-400">Start exploring to get personalized recommendations!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recommendations.map((post, index) => (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="group cursor-pointer"
                      onClick={() => navigate(`/post/${post._id}`)}
                    >
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-700/30 transition-all duration-300">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-lg flex items-center justify-center">
                          <span className="text-purple-400 font-bold text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium group-hover:text-purple-400 transition-colors duration-300 truncate">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                              {post.companyName}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <BiUpvote className="text-sm" />
                                {post.upvotes}
                              </span>
                              <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                {post.views || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InterviewExperienceDetail;