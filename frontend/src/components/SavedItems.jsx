import Navbar from "./Navbar";
import CompanyLogos from "./CompanyLogos";
import Footer from "./Footer";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaBookmark, FaRegBookmark, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function SavedItems() {
    const navigate = useNavigate();
    const [savedItems, setSavedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSavedItems = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URI}/api/v1/users/get-saved-items`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );
            setSavedItems(response.data.posts);
            setError(null);
        } catch (err) {
            setError("Failed to load saved items");
        } finally {
            setLoading(false);
        }
    };

    const handleUnsave = async (postId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URI}/api/v1/users/unsave-item/${postId}`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );
            fetchSavedItems();
        } catch (err) {
            console.error("Failed to unsave post");
        }
    };

    useEffect(() => {
        fetchSavedItems();
    }, []);

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    const convertDate = (d) => {
        const date = new Date(d);
        const formattedDate = date.toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
        return formattedDate;
    }

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="flex-1 flex flex-col">
                    <Navbar />
                    <CompanyLogos />
                    <div className="flex-1 p-10 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="flex-1 flex flex-col">
                    <Navbar />
                    <CompanyLogos />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-red-500 text-xl bg-gray-800/50 backdrop-blur-sm px-6 py-4 rounded-xl border border-red-500/30">
                            {error}
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="flex-1 flex flex-col">
                <Navbar />
                <CompanyLogos />
                <div className="flex-1 px-4 py-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="flex items-center gap-3 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6 group">
                                <FaBookmark className="text-purple-500 transform group-hover:scale-110 transition-transform duration-300" />
                                <div className="relative text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                    Saved Posts
                                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                                </div>
                            </h2>
                        </div>

                        {savedItems.length === 0 ? (
                            <div className="text-center py-16 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300">
                                <FaRegBookmark className="mx-auto text-7xl text-gray-600 mb-6 transform hover:scale-110 transition-transform duration-300" />
                                <h2 className="text-2xl font-semibold text-gray-400 mb-3">No saved posts yet</h2>
                                <p className="text-gray-500">Posts you save will appear here</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {savedItems.map((post) => (
                                    <div
                                        key={post._id}
                                        className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300 relative hover:-translate-y-1"
                                    >
                                        <div className="p-6">
                                            <div className="absolute top-4 right-4">
                                                <button
                                                    onClick={() => handleUnsave(post._id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 rounded-full hover:bg-gray-700/50 backdrop-blur-sm"
                                                    title="Unsave post"
                                                >
                                                    <FaTrash className="transform hover:scale-110 transition-transform duration-300" />
                                                </button>
                                            </div>

                                            <div className="mb-4">
                                                <h3
                                                    className="text-xl font-bold cursor-pointer text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2 hover:from-purple-300 hover:to-pink-300 transition-all duration-300"
                                                    onClick={() => navigate(`/post/${post._id}`)}
                                                >
                                                    {post.title}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-2 text-sm">
                                                    <span className="text-gray-300 rounded-lg bg-gradient-to-r from-gray-700/50 to-gray-800/50 px-3 py-1 border border-gray-600/30">
                                                        {post.companyName}
                                                    </span>
                                                    <span className="text-gray-500">|</span>
                                                    <span className="text-gray-400 font-light">{convertDate(post.createdAt)}</span>
                                                    {post.createdAt !== post.updatedAt && (
                                                        <>
                                                            <span className="text-gray-500">|</span>
                                                            <span className="text-gray-400 text-sm font-light">
                                                                edited: {convertDate(post.updatedAt)}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div
                                                className="text-gray-300 mt-4 line-clamp-3 group-hover:text-gray-200 transition-colors duration-300"
                                                dangerouslySetInnerHTML={{ __html: truncateText(post.content, 100) }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default SavedItems;
