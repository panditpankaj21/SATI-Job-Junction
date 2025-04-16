import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to view recommendations');
                return;
            }

            const response = await axios.get('http://localhost:3000/api/v1/recommendations', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setRecommendations(response.data.recommendations);
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            toast.error('Failed to fetch recommendations');
        } finally {
            setLoading(false);
        }
    };

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`);
    };

    if (loading) {
        return <div className="text-center py-4">Loading recommendations...</div>;
    }

    if (recommendations.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-xl font-semibold mb-4">Recommended Posts</h2>
                <p className="text-gray-600">No recommendations available yet. Start interacting with posts to get personalized recommendations!</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Recommended Posts</h2>
            <div className="space-y-4">
                {recommendations.map((post) => (
                    <div
                        key={post._id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handlePostClick(post._id)}
                    >
                        <h3 className="text-lg font-medium">{post.title}</h3>
                        <p className="text-gray-600 mt-1">{post.companyName}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                            <span className="mr-4">👤 {post.user.name}</span>
                            <span className="mr-4">👍 {post.upvotes}</span>
                            <span>👁️ {post.views}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Recommendations; 