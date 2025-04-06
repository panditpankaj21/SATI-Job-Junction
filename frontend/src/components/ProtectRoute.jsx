import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function ProtectRoute({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token")
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/v1/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(res.data.user);
            } catch (error) {
                console.error("Error fetching user:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser(); 
    }, []); 
    
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-200"></div>
                </div>
            </div>
        );
    }

    return user ? children : <Navigate to="/login" />;
}