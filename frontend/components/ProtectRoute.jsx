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

        fetchUser(); // Call the function
    }, []); // Add an empty dependency array

    if (loading) {
        return <div>Loading...</div>;
    }

    return user ? children : <Navigate to="/login" />;
}
